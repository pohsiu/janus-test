/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';

export default class Video extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {};
  }

  componentDidMount() {
    const { srcObject } = this.props;
    if (this.elem.srcObject !== srcObject) {
      this.elem.srcObject = srcObject;
    }
  }

  componentDidUpdate() {
    const { srcObject } = this.props;
    if (this.elem.srcObject !== srcObject) {
      this.elem.srcObject = srcObject;
    }
  }

  render() {
    const { srcObject, ...rest } = this.props;
    return (
      <video ref={(elem) => { this.elem = elem; }} {...rest} />
    );
  }
}
