import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Link,
    NavLink,
    Redirect
} from 'react-router-dom';
import './style.less';
import ImageData from './imageData';
const requireContext = require.context("./img",true);
const images = requireContext.keys().map(requireContext);
ImageData.map(function (item,i) {
    item.url=images[i]
})
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
        window.addEventListener('scroll',this.handleScroll);
    }
    componentWillUnmount(){
        window.removeEventListener('scroll',this.handleScroll)
    }
    handleScroll = (e)=>{
        let ScrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        if(ScrollTop<50){
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
                  <div className={`header`}>
                      <ul className={`top-links clearFix`}>
                          <li><NavLink to={`/Create`}  exact activeClassName={`active`}> <i className={`icon-username`}></i>Create</NavLink></li>
                          <li><NavLink to={`/skill`} activeClassName={`active`}> <i className={`icon-upgrade`}></i>Skill</NavLink></li>
                          <li><NavLink to={`/PersonalProjects`} activeClassName={`active`}> <i className={`icon-star`}></i>Personal Projects</NavLink></li>
                          <li><NavLink to={`/Contact`} activeClassName={`active`}> <i className={`icon-mail`}></i>Contact</NavLink></li>
                      </ul>
                  </div>
                  <div className={`content`}>
                      <Route path={`/`} exact render={()=>(<Redirect to={`/Create`}/>)}/>
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
        this.state={
            top:0,
            title:'个人简历',
            currentElem:0//当前选中的按钮
        }
    }
    componentDidMount(){

    }
    handleScroll=(e)=>{
        e.preventDefault();
        let position = parseInt(e.target.getAttribute('href')),
            title = e.target.getAttribute('title');
        this.setState({
            top:-445*position,
            currentElem:position,
            title:title
        })
    }
    render(){
        return(
            <div className={`clearFix`}>
                <ScrollToTopOnMount/>
                <div className={`left-link`}>
                    <ul className={`links`}>
                        <li className={`${this.state.currentElem === 0?'current':''}`}><a onClick={this.handleScroll} title={`个人简历`} href="0">My Resume</a></li>
                        <li className={`${this.state.currentElem === 1?'current':''}`}><a onClick={this.handleScroll} title={`成长履历`} href="1">Growth Record</a></li>
                        <li className={`${this.state.currentElem === 2?'current':''}`}><a onClick={this.handleScroll} title={`一些照片`} href="2">Some Photo</a></li>
                        <li className={`${this.state.currentElem === 3?'current':''}`}><a onClick={this.handleScroll} title={`一些爱好`} href="3">Some Hobby</a></li>
                    </ul>
                </div>
                <div className={`right-content`}>
                    <div className={`head-bar`}>
                        <span className={`title`}>{this.state.title}</span>
                    </div>
                    <div className={`warp`}>
                        <ul className={`article-list`} ref={`article_list`} style={{top:this.state.top}}>
                           <li className={`article`}>
                                <h2>王 田</h2>
                                <h4 className={`mt10`}>邮箱：2281334050@qq.com</h4>
                                <h4 className={`mt5`}>毕业院校：上海电视大学，计算机应用与管理</h4>
                                <h4 className={`mt5`}>Github：<a target={`_blank`} className={`linkStyle`} href="https://github.com/2281334050">Tian King</a></h4>
                           </li>
                           <li className={`article`}>
                                2
                           </li>
                           <li className={`article`}>
                                3
                           </li>
                           <li className={`article`}>
                           </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
    /*相片路由*/
function PhotoRoute() {
    return(
        <div className={`photos`}>
            {
                ImageData.map(function (key) {
                    return(
                       <Link key={key.id} to={{pathname:`/photo/${key.id}`}} >
                            <Image url={key.url}/>
                           <p>{key.title}</p>
                       </Link>
                    )
                })
            }
        </div>
    )
}

function Image(props) {
    return(
        <img src={`http://localhost:3000/${props.url}`} style={{height:100,width:100}}/>
    )
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
                <NavLink to={`/Create`} activeClassName={`active`} exact  className={`icon-username`}></NavLink>
                <NavLink to={`/skill`} activeClassName={`active`}  className={`icon-upgrade`}></NavLink>
                <NavLink to={`/PersonalProjects`} activeClassName={`active`}  className={`icon-star`}></NavLink>
                <NavLink to={`/Contact`} activeClassName={`active`} className={`icon-mail`}></NavLink>
            </div>
        </div>
    )
}
/*路由配置*/
const routes = [
    {
        path:'/Create',
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
        <Route path={route.path} exact render={(props)=>
            {
                return <route.component/>
            }
        }/>
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
