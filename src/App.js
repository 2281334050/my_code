import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
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
                          <li><NavLink to={`/Create`}   activeClassName={`active`}> <i className={`icon-username`}></i>Create</NavLink></li>
                          <li><NavLink to={`/skill`} activeClassName={`active`}> <i className={`icon-upgrade`}></i>Skill</NavLink></li>
                          <li><NavLink to={`/PersonalProjects`} activeClassName={`active`}> <i className={`icon-star`}></i>Personal Projects</NavLink></li>
                          <li><NavLink to={`/Contact`} activeClassName={`active`}> <i className={`icon-mail`}></i>Contact</NavLink></li>
                      </ul>
                  </div>
                  <div className={`content`}>
                      {/*路由重定向*/}
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
            title:'',
            currentElem:0//当前选中的按钮
        }
    }
    componentDidMount(){
        console.log(this.props.location)

    }
    handleClick=(e)=>{
        const title = e.target.getAttribute('label');
        this.setState({title:title})
    }
    render(){
        return(
            <Router>
                <div className={`clearFix`}>
                    <ScrollToTopOnMount/>
                    <div className={`left-link`}>
                        <ul className={`links`}>
                            <li><NavLink to={`/Create/MyResume`} onClick={this.handleClick} label={`个人简历`} activeClassName={`current`}>My Resume</NavLink></li>
                            <li><NavLink to={`/Create/GrowthRecord`} onClick={this.handleClick} activeClassName={`current`} label={`个人履历`}>Growth Record</NavLink></li>
                            <li><NavLink to={`/Create/MyPhotos`} onClick={this.handleClick} activeClassName={`current`} label={`一些照片`}>My Photos</NavLink></li>
                            <li><NavLink to={`/Create/MyHobby`} onClick={this.handleClick} activeClassName={`current`} label={`个人喜好`}>My Hobby</NavLink></li>
                        </ul>
                    </div>
                    <div className={`right-content`}>
                        <div className={`head-bar`}>
                            <span className={`title`}>{this.state.title}</span>
                        </div>
                        <div className={`warp`}>
                            {/*二级路由重定向*/}
                            <Route path={`/Create`} exact render={()=>(<Redirect to={`/Create/MyResume`}/>)}/>
                            {
                                this.props.routes.map(function (route,i) {
                                  return  <RouteWithSubRoutes key={i} {...route}/>
                                })
                            }
                        </div>
                    </div>
                </div>
            </Router>
        )
    }
}
    /*相片页逻辑*/
class  PhotoRoute extends Component{
    constructor(props){
        super(props)
        this.state={
            ModalUrl:'',/*图片路径*/
            isShow:false,/*查看大图模态框显示与隐藏*/
            ImgTitle:'',/*图片title*/
            picKey:0/*当前查看的图片key*/
        }
    }
    handleClick = (e)=>{
        let key = e.target.getAttribute('data-key');
        this.setState((prevState)=>({
            isShow:!prevState.isShow,
        }));
        this.changePic(key);
    }
    changePic = (key)=>{ /*公共改变图片方法*/
        console.log(key)
        if(key !== null){
            this.setState({
                ModalUrl:`http://localhost:3000/${ImageData[parseInt(key)].url}`,
                ImgTitle:ImageData[parseInt(key)].title,
                picKey:parseInt(key)
            })
        }
    }
    turnPage = (e) =>{
        let direction = parseInt(e.target.getAttribute('direction'));
        let key = this.state.picKey;
        if(direction>0){
            this.changePic(key+1);
        }else{
            this.changePic(key-1);
        }
    }
    render(){
        return(
            <div className={`photos`}>
                {
                    ImageData.map( (key)=> {
                        return(
                            <a  href={`javascript:;`} onClick={this.handleClick} key={key.id} >
                                {/*父组件传值不允许穿key属性*/}
                                <Image url={`http://localhost:3000/${key.url}`} k={key.id} styles={{h:100,w:100}}/>
                                <p data-key={key.id}>{key.title}</p>
                            </a>
                        )
                    })
                }
                <Modal url={this.state.ModalUrl} turnPage={this.turnPage} picKey={this.state.picKey} title={this.state.ImgTitle} isShow={this.state.isShow} ModelClose={this.handleClick}/>
            </div>
        )
    }
}

function Image(props) {
    return(
        <img  src={props.url} data-key={props.k} style={{height:props.styles.h,width:props.styles.w}}/>
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
                <NavLink to={`/Create`} activeClassName={`active`}   className={`icon-username`}></NavLink>
                <NavLink to={`/skill`} activeClassName={`active`}  className={`icon-upgrade`}></NavLink>
                <NavLink to={`/PersonalProjects`} activeClassName={`active`}  className={`icon-star`}></NavLink>
                <NavLink to={`/Contact`} activeClassName={`active`} className={`icon-mail`}></NavLink>
            </div>
        </div>
    )
}
/*简介页*/
function MyResume() {
    return(
        <div className={`article`}>
            <h2>王 田</h2>
            <h4 className={`mt10`}>邮箱：2281334050@qq.com</h4>
            <h4 className={`mt5`}>毕业院校：上海电视大学，计算机应用与管理</h4>
            <h4 className={`mt5`}>Github：<a target={`_blank`} className={`linkStyle`} href="https://github.com/2281334050">Tian King</a></h4>
        </div>
    )
}
/*成长页*/
function GrowthRecord() {
    return(
        <div>GrowthRecord</div>
    )
}
/*相册页*/
function MyPhotos() {
    return(
        <div className={`article`}>
            <PhotoRoute/>
        </div>
    )
}
/*爱好页*/
function MyHobby() {
    return(
        <div>MyHobby</div>
    )
}
/*路由配置*/
const routes = [
    {
        path:'/Create',
        component:Create,
        routes:[
            {
                path:'/Create/MyResume',
                component:MyResume
            },
            {
                path:'/Create/GrowthRecord',
                component:GrowthRecord
            },
            {
                path:'/Create/MyPhotos',
                component:MyPhotos
            },
            {
                path:'/Create/MyHobby',
                component:MyHobby
            }
        ]

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
        <Route path={route.path}  render={(props)=>
            {
                return <route.component {...props} routes={route.routes}/>
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
/*相册页查看大图模态框*/
function Modal (props) {
    if(!props.isShow){
        return null
    }
    return (
        <div className={`modal`}>
            <div className={`pics`}>
                <Image url={props.url} styles={{h:500,w:500}} />
                <p>{props.title}</p>
                <a className={`close icon-close`} href={`javascript:;`} onClick={props.ModelClose}>
                </a>
                {
                    function () {
                        if(props.picKey>0 && props.picKey < ImageData.length-1){
                            return(
                                <div>
                                    <a href={`javascript:`} direction={-1} onClick={props.turnPage} className={`left-tick  icon-left-arrow`}></a>
                                    <a href={`javascript:`} direction={1} onClick={props.turnPage} className={`right-tick  icon-left-arrow`}></a>
                                </div>
                                )

                        }else{
                            if(props.picKey === 0){
                               return <a href={`javascript:;`} direction={1} onClick={props.turnPage} className={`right-tick  icon-left-arrow`}></a>
                            }else if(props.picKey === ImageData.length-1){
                                return <a href={`javascript:;`} direction={-1} onClick={props.turnPage} className={`left-tick  icon-left-arrow`}></a>
                            }
                        }
                    }()
                }
            </div>
        </div>
    )
}
export default App;
