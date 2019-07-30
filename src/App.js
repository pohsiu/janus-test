import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { JanusHelper, plugins, Janus } from 'janus-helper'
import Video from './Video';

const config = {
  debug: true || false, // set console will log information for debug or not
  server: 'wss://localhost:8989/', // set janus server wss url address
  iceServers: [{urls: "turn:127.0.0.1:10102?transport=udp", username: "turnuser", credential: "turnpwd"}],
};

const basicInfo = { 
  roomInfo: { // videoRoom info -> required for VideoRoom plugin
    id: 2233, // the id for creating janus-videoroom
    unigueRoomId: 'test-2233', // the id for identify each room instance e.g. uuid()
  },
  userInfo: { // user info -> required
    id: '1234',
    name: 'testname',
  }, 
  // extra field for other usage -> optional for VideoRoom plugin
  filename: 'filename', // the rec video file name
  rec_dir: '/path/to/recordings-folder/', // the rec video file path to janus-server
  createRoomConfig: {
    request: 'create',
    room: 2233, 
    // <unique numeric ID, optional, chosen by plugin if missing>, 
    notify_joining: true,
    /* 
      true|false (optional, whether to notify all participants when a new
      participant joins the room. The Videoroom plugin by design only notifies
      new feeds (publishers), and enabling this may result extra notification
      traffic. This flag is particularly useful when enabled with \c require_pvtid
      for admin to manage listening only participants. default=false) 
    */
    bitrate: 128000,
    publishers: 2, // default is 3,
    record: true, // deside record video stream or not
    rec_dir: '/path/to/recordings-folder/',
    // other property could refer to Video Room API https://janus.conf.meetecho.com/docs/videoroom.html
  }
};
class App extends Component {
  constructor() {
    super();
    this.state = {
      localStream: undefined,
      remoteList: {},
    }
    
    this.janus = new JanusHelper(config);
  }
  componentDidMount() {

  }
  addPlugIns = () => {
    const errorCallback = er => console.log(er);
    const successCallback = (pluginHandler) => {
      this.videoRoomHandler = pluginHandler;
    };
    this.janus.injectPlugin(
      plugins.VideoRoom,
      basicInfo,
      {
        onlocalstream: (stream) => {
          this.setState({ localStream: stream });
        },
        onremotestream: (remoteList) => {
          this.setState({ remoteList });
        },
        consentDialog: (on) => {
        },
        mediaState: (medium, on) => {
        },
        webrtcState: (on) => {
        },
        onmessage: (msg, jsep) => { 
        },
        oncleanup: () => {},
      }
    ).then(successCallback).catch(errorCallback);
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
