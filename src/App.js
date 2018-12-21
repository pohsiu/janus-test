import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import JanusHelper from './utils/janus-helper';
import { VideoRoom, Sip } from './utils/plugins';

import Video from './Video';

class App extends Component {
  constructor() {
    super();
    this.state = {
      localStream: undefined,
      remoteList: {},
    }
    this.janus = new JanusHelper({
      debug: false,
      server: 'wss://127.0.0.1:8989/',
    });
  }
  componentDidMount() {

  }
  addPlugIns = () => {
    this.janus.addPlugin(
      VideoRoom,
      {
        roomId: 2233,
        userInfo: {
          id: 'myuserid',
          name: 'myusername',
        },
      },
      {
        success: (pluginHandler) => {
          this.videoRoomHandler = pluginHandler;
        },
        onlocalstream: (stream) => {
          this.setState({ localStream: stream });
        },
        onremotestream: (remoteList) => {
          this.setState({ remoteList });
        },
      }
    );
    // use sip plugin after you have a sip server to connect
    // this.janus.addPlugin(
    //   Sip,
    //   {
    //     sipServer: 'mysipserverip',
    //     sipPort: '5060',
    //     userInfo: {
    //       id: 'myuserid',
    //       name: 'myusername',
    //       secret: 'mysecret',
    //     },
    //   },
    //   {
    //     onremotestream: (stream) => {
    //       console.log('[SIP] remoteAudio', stream);
    //       this.setState({ sipAudio: stream });
    //     },
    //     onmessage: {
    //       success: (pluginHandler) => {
    //         this.sipHandler = pluginHandler;
    //       },
    //       incomingcall: (userInfo, data) => {
    //         const { displayname, username } = userInfo;
    //         // const { jsep, srtp, offerlessInvite, doVideo, doAudio } = data;
    //         console.log('[SIP] PhoneCall from:', displayname, username);
    //         this.handlerIncomeCall(data); // now accepted directly;
    //       },
    //       accepted: () => {

    //       },
    //       calling: () => {

    //       },
    //       registered: () => {
    //         console.log('[SIP] already registered');
    //       },
    //       hangup: () => {

    //       },
    //     },
    //   },
    // );
  }

  componentWillUnmount() {
    this.janus.destroy();
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {this.state.localStream &&  <Video id="localVideo" srcObject={this.state.localStream} autoPlay style={{ width: '40%' }} />}
          {this.state.remoteList && Object.keys(this.state.remoteList).map((key, index) => {
                return <Video key={Math.floor(Math.random() * 1000)} srcObject={this.state.remoteList[key]} autoPlay style={{ width: '40%' }}/>
            })
            }
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
