import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import './style.less';
class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            className:'hide'
        }
    }
    componentDidMount(){
        window.addEventListener('scroll',this.handleScroll)
    }
    componentWillUnmount(){
        window.removeEventListener('scroll',this.handleScroll)
    }
    handleScroll = (e)=>{
        let ScrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        if(ScrollTop<10){
            this.setState({className:'hide'})
        }else{
            this.setState({className:''})
        }
    }
  render() {
    return (
      <div className={`main`}>
          <TopBar class={this.state.className}/>
          <Router>
              <div className={`main-content`}>
                  <ul className={`top-links clearFix`}>
                      <li><Link to={`/`}><i className={`icon-username`}></i>Create</Link></li>
                      <li><Link to={`/skill`}><i className={`icon-upgrade`}></i>Skill</Link></li>
                      <li><Link to={`/PersonalProjects`}><i className={`icon-star`}></i>Personal Projects</Link></li>
                      <li><Link to={`/GetMe`}><i className={`icon-mail`}></i>Contact</Link></li>
                  </ul>
                  <div className={`content`}>
                      <Route exact path={`/`} component={Create}/>
                      <Route exact path={`/skill`} component={Skill}/>
                      <Route exact path={`/PersonalProjects`} component={PersonalProjects}/>
                      <Route exact path={`/GetMe`} component={GetMe}/>
                  </div>
              </div>
          </Router>
      </div>
    );
  }
}
/*简介页*/
function Create() {
    return(
        <div>

        </div>
    )
}
/*技能页*/
function Skill() {
    return(
        <div>
            <h1>Skill</h1>
        </div>
    )
}
/*个人项目页*/
function PersonalProjects() {
    return(
        <div>
            <h1>PersonalProjects</h1>
        </div>
    )
}
/*得到我*/
function GetMe() {
    return(
        <div>
            <h1>GetMe</h1>
        </div>
    )
}
/*顶部悬浮导航条*/
function TopBar(props) {
    let className = props.class;
    return(
        <div className={`top-Bar ${className}`}>

        </div>
    )
}
export default App;
