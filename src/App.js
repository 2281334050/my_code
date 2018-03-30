import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import './style.less';
class App extends Component {
  render() {
    return (
      <div className={`main`}>
          <Router>
              <div className={`main-content`}>
                  <ul className={`top-links clearFix`}>
                      <li><Link className={`self`} to={`/`}>Create</Link></li>
                      <li><Link to={`/skill`}>Skill</Link></li>
                      <li><Link to={`/PersonalProjects`}>Personal Projects</Link></li>
                      <li><Link to={`/GetMe`}>Get Me</Link></li>
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
            <h1>没有朋友</h1>
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
export default App;
