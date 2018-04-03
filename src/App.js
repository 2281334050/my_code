import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';
import './style.less';
/*页面主体*/
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
          <Router>
              <div className={`main-content`}>
                  <TopBar class={this.state.className}/>
                  <ul className={`top-links clearFix`}>
                      <li><Link to={`/`}><i className={`icon-username`}></i>Create</Link></li>
                      <li><Link to={`/skill`}><i className={`icon-upgrade`}></i>Skill</Link></li>
                      <li><Link to={`/PersonalProjects`}><i className={`icon-star`}></i>Personal Projects</Link></li>
                      <li><Link to={`/Contact`}><i className={`icon-mail`}></i>Contact</Link></li>
                  </ul>
                  <div className={`content`}>
                      {
                          routes.map((route,i) => (
                              <RouteWithSubRoutes key={i} {...route}/>
                          ))
                      }
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
function Contact() {
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
            <div className={`links clearFix`}>
                <Link to={`/`} className={`icon-username`}></Link>
                <Link to={`/skill`} className={`icon-upgrade`}></Link>
                <Link to={`/PersonalProjects`} className={`icon-star`}></Link>
                <Link to={`/Contact`} className={`icon-mail`}></Link>
            </div>
        </div>
    )
}
/*路由配置*/
const routes = [
    {
        path:'/',
        component:Create
    },
    {
        path:'/skill',
        component:Skill
    },
    {
        path:'/PersonalProjects',
        component:PersonalProjects
    },
    {
        path:'/Contact',
        component:Contact
    },
];
/*路由公共方法*/
function RouteWithSubRoutes (route){
    return(
        <Route path={route.path} exact component={route.component}/>
    )
}
export default App;
