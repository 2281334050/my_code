import React, { Component } from 'react';
import http from './server';//封装的请求方法
import api from './libraries/api_list';//接口列表
import settings from './settings';
import * as qiniu from 'qiniu-js';
import PublicModel from './publicModel';//公共弹出框
class PublishPictures extends Component{
  constructor(props){
      super(props);
      const user = JSON.parse(localStorage.getItem('king-token'));
      this.state={
          current_photo_list:null,
          photo_lists:{
            list:[],
            is_ajaxing:false
          },
          photos:{list:[],is_ajaxing:false},
          isShow:0,//model对话框0 不显示 1新建相册 2上传照片 3照片编辑 4编辑相册名称 5弹出提示对话框
          photo_list_name:'',//最后提交相册的name
          edit_photo_list_id:null, //当前点击编辑的相册的id
          upload_token:user!==null ? user.token.split(".")[3] : null,//上传所需token
          upload_config:{//上传配置
              useCdnDomain: true,
              disableStatisticsReport: false,
              retryCount: 6,
              region: qiniu.region.z0
          },
          currentPhoto:{
              src:null,
              name:null,
              id:null,
              description:null
          }//当前查看的图片
      }
  }
  GetPhotoLists= async ()=>{//获取相册列表
    this.setState({
        photo_lists:{list:[],is_ajaxing:true},
    })
      const res = await http.get(api.get_photo_lists,[]);
      if(res.status===1){
          this.setState({
              photo_lists:{list:res.list,is_ajaxing:false},
          })
          let flag = false;
          if(this.state.photo_lists.list.length!==0){
              this.state.photo_lists.list.map((v,k)=>{
                  if(this.current_photo_list === v.id){
                      flag = true;
                  }
              })
              if(!flag){
                  this.setState({
                      current_photo_list:res.list[0].id
                  })
              }
              this.GetPhotos();
          }else{
              this.setState({
                  current_photo_list:null
              })
          }
      }
  }
  GetPhotos= async ()=>{//取图片
    this.setState({
        photos:{list:[],is_ajaxing:true},
    })
      let param = {photo_list_id:this.state.current_photo_list}
      const res = await http.post(api.get_photos,param);
      if(res.status===1){
          this.setState({
              photos:{list:res.list,is_ajaxing:false},
          })
      }
  }
  componentDidMount(){
      this.GetPhotoLists();//获取相册列表
  }
  insetInput=(e)=>{
      this.setState({
          photo_list_name:e.target.value
      })
  }
  handleChange= async (id)=>{//切换相册
      await this.setState({
          current_photo_list:parseInt(id)
     });
     this.GetPhotos();
  }
  popBoxBtnSure=()=>{//请求添加相册接口//编辑相册入口//删除相册入口//编辑当前查看图片信息入口
      let msg_obj={},
          params;
      switch(this.state.isShow){
          case 1:case 4:
              if(this.state.photo_list_name===''){
              msg_obj = {msg:'请输入相册名称',status:0}
              this.props.popMsg(msg_obj);
              return false;
              }
              if(this.state.isShow === 1){//新增
                  params = {name:this.state.photo_list_name};
                  this.publicAJAX(params,api.addPhotoAlbum,'POST');
              }else{//编辑
                  params = {id:this.state.edit_photo_list_id,new_name:this.state.photo_list_name}
                  this.publicAJAX(params,api.edit_photo_list,'POST');
              }
          break;
          case 2:
            if(this.state.currentPhoto.name===''){
                msg_obj = {msg:'请输入图片名称',status:0}
                this.props.popMsg(msg_obj);
                return false;
                }
                params = {name:this.state.currentPhoto.name,id:this.state.currentPhoto.id,description:this.state.currentPhoto.description}
                this.publicAJAX(params,api.edit_photo,'POST')
          break;
          case 5:
              params = {id:this.state.edit_photo_list_id}
              this.publicAJAX(params,api.delete_photo_list,'POST');
          break;
          default:
          break;
      }
  }
  showPopBox=(type,old_name,edit_list_id)=>{//打开弹窗
      this.setState({
          isShow:type,
          photo_list_name:old_name,
          edit_photo_list_id:edit_list_id
      })
  }
  cheackPhoto=(type,id,src,name,description)=>{
    this.setState({
        isShow:type,
        currentPhoto:{
            src:src,
            name:name,
            id:id,
            description:description
        }
    })
  }
  cancel=()=>{//关闭弹窗
      this.setState({
          isShow:0,
          photo_list_name:'',
          edit_photo_list_id:null,
          currentPhoto:{
            src:null,
            name:null,
            id:null,
            description:null
        }
      })
  }
  changeImgName=(e,type)=>{//type 1是修改名字触发,2是修改文字描述触发
    let dom = e.target.value;
    this.setState((prevState)=>{
        if(type===1){
            return {
                currentPhoto:{
                    src:prevState.currentPhoto.src,
                    name:dom,
                    id:prevState.currentPhoto.id,
                    description:prevState.currentPhoto.description
                }
            }
        }else{
            return {
                currentPhoto:{
                    src:prevState.currentPhoto.src,
                    name:prevState.currentPhoto.name,
                    id:prevState.currentPhoto.id,
                    description:dom
                }
            } 
        }
    })
}
  popBoxHtml=()=>{//popbox弹窗内容
      if(this.state.isShow){
          switch (this.state.isShow){
              case 1:case 4://编辑&&新建相册
                  return (<PublicModel className={`CreatePhotoAlbum`} title={`新建相册`}>
                      <div className={`form-item mt15`}>
                          <input type="text" name={`name`} defaultValue={this.state.photo_list_name} onChange={this.insetInput} placeholder={`请输入相册名`}/>
                      </div>
                      <div className={`form-item mt15`}>
                          <a className={`sure`} onClick={this.popBoxBtnSure} href="javascript:;">提交</a>
                          <a className={`cancel`} onClick={this.cancel} href="javascript:;">取消</a>
                      </div>
                  </PublicModel>);
                  break;
              case 2://查看
              return(<PublicModel cencel={this.cancel} className={`checkImage`} title={`查看图片`}>
                      <div className={`form-item clearFix`}>
                        <div className={`img-detail fr`}>
                            <input type="text" name={`name`} maxLength={`10`} defaultValue={this.state.currentPhoto.name} onChange={(e)=>this.changeImgName(e,1)} placeholder={`请输入图片名最大10字符`}/>
                            <textarea maxLength={`100`} defaultValue={this.state.currentPhoto.description} onChange={(e)=>this.changeImgName(e,2)} className={`mt10`} placeholder={`请输入名字描述最大100字符`} name={`description`}>
                                
                            </textarea>
                            <a className={`sure`} onClick={this.popBoxBtnSure} href="javascript:;">提交</a>
                            <a className={`cancel`} onClick={this.cancel} href="javascript:;">取消</a>
                        </div>
                        <div className={`img-box`}>
                            <img src={this.state.currentPhoto.src}/>
                        </div>
                      </div>
                    </PublicModel>);
                  break;
              case 3:
                  break;
              case 5:
              return(<PublicModel className={`MsgTips`} title={`提示`}>
                        <div className={`form-item mt15`}>
                            <div className={`msg`}>确定删除该相册吗？</div>
                        </div>
                        <div className={`form-item mt15`}>
                            <a className={`sure`} onClick={this.popBoxBtnSure} href="javascript:;">确定</a>
                            <a className={`cancel`} onClick={this.cancel} href="javascript:;">取消</a>
                        </div>
                    </PublicModel>);
                  break;
              default:
                  break;
          }
      }else{
          return null;
      }
  }
  publicAJAX=async(params,api,method)=>{//公共ajax
      let msg_obj={},
          res;
          console.log(params)
      if(method==='POST'){
           res = await http.post(api,params);
      }else{
           res = await http.get(api,params);
      }
      if(res.status===1){
           msg_obj = {msg:res.msg,status:1};
          this.props.popMsg(msg_obj);
          this.cancel();//关闭对话
          this.GetPhotoLists();//取得相册列表
      }else{
           msg_obj = {msg:res.msg,status:0};
          this.props.popMsg(msg_obj);
      }
  }
  initUpload(file,key,token,putExtra,config){
      let observable = qiniu.upload(file,key,token,putExtra,config);
          observable.subscribe({
              next:(res)=>{
                  const total = res.total;
                 let photos = this.state.photos.list;
                  photos.map((v,k)=>{
                      if(v.key === key){
                          v.progress = total.percent
                          this.setState({
                              photos:{list:photos,is_ajaxing:false}
                          })
                      }
                  })
              },
              error:(res)=>{
                  if(res.code===401){
                    localStorage.removeItem('king-token');
                    window.location.href=`/admin`;
                  }
              },
              complete:(res)=>{
                  if(res.status===1){
                      let photos = this.state.photos.list;
                      photos.map((v,k)=>{
                          if(v.key === key){
                              photos[k] = res.data[0];
                              this.setState({
                                  photos:{list:photos,is_ajaxing:false}
                              })
                          }
                      }) 
                  }
              }
          });
  }
  changeFile=(e)=>{//选取上传文件
      let file = e.target.files[0];
      if(file){
          let key  = file.name;
          let putExtra={
              fname:'',
              params:{
                  "x:name":key.split(".")[0],
                  "x:photo_list_id":this.state.current_photo_list,
              },
              mimeType:settings.upload.allowType||null
          };
          const new_img = {
              id:null,
              key:key,
              name:key.split(".")[0],
              is_loading:true,
              progress:0,
              url:''
          }
          if(typeof FileReader !== 'undefined'){//判断浏览器支持base64转码
              //上传前预览
          let reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = (e)=>{//转图片为base64
                  new_img.url = e.currentTarget.result,
                  this.setState((prevState)=>{
                      return {photos:{list:prevState.photos.list.concat(new_img),is_ajaxing:false}}
                  })
              }
          }
          //上传初始化开始
          this.initUpload(file,key,this.state.upload_token,putExtra,this.state.upload_config);
      }
  }
  MapPhotos=()=>{//遍历相册
    if(this.state.photos.is_ajaxing){
        return <div style={{textAlign:"center",width:"100%"}}><i className={`icon-spin5 animate-spin`}></i></div>
    }
    if(this.state.photos.list.length>0){
          return this.state.photos.list.map((v,k)=>(
              <div onClick={(e)=>this.cheackPhoto(2,v.id,settings.qiniu.domain+v.key,v.name,v.description)} key={k} className={`photo-item fl`}>
                  <div  className={`img-box`}>
                      <img src={v.is_loading?v.url:settings.qiniu.domain+v.key}/>
                      {
                           v.is_loading === true ?
                           <div className={`progress-mark`}>
                               <div className={`progress`}>
                                   <div className={`progress-bar`} style={{width:`${v.progress}%`}}></div>
                               </div>
                           </div>  
                           :''
                      }
                  </div>  
                  <span className={`title`}>{v.name}</span>
              </div> 
            ))
      }else{
          return <div className={`empty`}>暂无照片</div>
      }
  }
  render(){
      return(
          <div className={`PublishPictures`}>
            <div className={`choose-photo-list`}>
            {
              <PhotoLists photo_lists={this.state.photo_lists.list} is_ajaxing={this.state.photo_lists.is_ajaxing} current_photo_list={this.state.current_photo_list} handleChange={this.handleChange} showPopBox={this.showPopBox}/>
            }
            {
               !this.state.photo_lists.is_ajaxing ?<a className={`add-photo-list ml10`} onClick={(e)=>this.showPopBox(1,null,null)} data-type="1" href={`javascript:;`}>NewOne</a>:''
            }
            </div>
            <div className={`photos mt15 clearFix`}>
            {
                this.state.photo_lists.list.length === 0 ? <div className={`empty`}>请先新建相册即可上传照片</div>:this.MapPhotos()
                               
            }
            {//添加按钮
                this.state.photo_lists.list.length !== 0 && 
                  <div className={`fl`}>
                      <a id={`add-photo`} ref={`add_photo`} className={`add-photo fl`}>
                          <input type="file" style={{width:'100%',height:'100%',position:'absolute',opacity:0}} onChange={this.changeFile} id="select"/>
                      </a>
                  </div>
            }
            </div>
              {this.popBoxHtml()}
          </div>
      )
  }
}

class PhotoLists extends Component{
   constructor(props){
      super(props)
   }
   shouldComponentUpdate(nextProps,nextState){
        if(this.props===nextProps){
            return false;
        }
        return true;
   }
   Rush=()=>{
     if(this.props.is_ajaxing){
        return <div style={{textAlign:"center",width:"100%"}}><i className={`icon-spin5 animate-spin`}></i></div>
     }
     if(this.props.photo_lists.length===0){
      return <span className={`empty`}>暂无相册</span>
    }
    if(this.props.photo_lists.length>0){
        return this.props.photo_lists.map((v,k)=>(
          <div key={k}>
          <input type={`radio`} name={`photo-list`}  checked={this.props.current_photo_list === v.id ? true : false} onChange={(e)=>this.props.handleChange(v.id)} value={v.id}/>
          <span>
              <h4>{v.name}</h4>
              <span className={`operation-btn`}>
                  <i data-name={v.name} data-id={v.id} data-type="4" onClick={(e)=>this.props.showPopBox(4,v.name,v.id)} className={`icon-pencil mr5`}></i>
                  <i data-id={v.id} onClick={(e)=>this.props.showPopBox(5,null,v.id)} data-type="5" className={`icon-trash ml5`}></i>
              </span>
          </span>
          </div>  
        ))
    }
   }
   render(){
      return(
        this.Rush()
      )
   }
}

export default PublishPictures;