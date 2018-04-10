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
            className:'hide',
            isLoading:false
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
                      <li><OldSchoolMenuLink to={`/`} activeOnlyWhenExact={true} class={`icon-username`} label={`Create`}/></li>
                      <li><OldSchoolMenuLink to={`/skill`} class={`icon-upgrade`} label={`Skill`}/></li>
                      <li><OldSchoolMenuLink to={`/PersonalProjects`} class={`icon-star`} label={`Personal Projects`}/></li>
                      <li><OldSchoolMenuLink to={`/Contact`} class={`icon-mail`} label={`Contact`}/></li>
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
class Create extends Component{
    constructor(props){
        super(props);
        console.log(props.match)
    }
    render(){
        return(
            <div>
                <ScrollToTopOnMount/>
                Create
            </div>
        )
    }
}
/*技能页*/
class Skill extends Component {
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div>
                <ScrollToTopOnMount/>
                <h1>Skill</h1>
            </div>
        )
    }
}
/*个人项目页*/
class PersonalProjects extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div>
                <ScrollToTopOnMount/>
                <h1>PersonalProjects</h1>
            </div>
        )
    }
}
/*得到我*/
class Contact extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return(
            <div>
                <ScrollToTopOnMount/>
                <h1>Contact</h1>
            </div>
        )
    }
}
/*顶部悬浮导航条*/
function TopBar(props) {
    let className = props.class;
    return(
        <div className={`top-Bar ${className}`}>
            <div className={`links clearFix`}>
                <OldSchoolMenuLink to={`/`} activeOnlyWhenExact={true} class={`icon-username`}/>
                <OldSchoolMenuLink to={`/skill`}  class={`icon-upgrade`}/>
                <OldSchoolMenuLink to={`/PersonalProjects`}  class={`icon-star`}/>
                <OldSchoolMenuLink to={`/Contact`}  class={`icon-mail`}/>
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
/*导航LINK*/
function OldSchoolMenuLink(props) {
    return(
        <Route path={props.to} exact={props.activeOnlyWhenExact} children={({match})=>(
            <Link className={match?'active':''} to={props.to}><i className={`${props.class}`}></i>{props.label}</Link>
        )}/>
    )
}
/*路由跳转回到顶部组件*/
class ScrollToTopOnMount extends Component {
    componentDidMount(prevProps) {
        window.scrollTo(0, 0)
    }

    render() {
        return null
    }
}
/*AJAXloading条*/
function Ajax_loading() {
    return(
        <div className={`ajaxLoader`}>
            <div className={`outer`}></div>
            <div className={`inner`}></div>
        </div>
    )
}
export default App;
