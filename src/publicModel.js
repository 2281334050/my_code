import React, { Component } from 'react';
/*公共弹出操作框*/
class PublicModel extends Component{
  constructor(props){
      super(props);
      this.state={
          style:{left:0,top:0}
      }
  }
  componentDidMount(){
      let winH = window.innerHeight,
          winW = window.innerWidth,
          w = this.refs.MsgContent.offsetWidth,
          h = this.refs.MsgContent.offsetHeight;
      this.setState({
          style:{left:`${winW/2-w/2}px`,top:`${winH/2-h/2}px`}
      })
  }
  render(){
      return(
          <div className={`PublicModel`}>
              <div ref={`MsgContent`} style={this.state.style} className={`${this.props.className} MsgContent`}>
                  <div className={`MsgTitle`}>
                      {this.props.title}
                  </div>
                  <div className={`MsgBox`}>
                      {this.props.children}
                  </div>
              </div>
          </div>
      )
  }
}
export default PublicModel;