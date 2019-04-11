// pages/gamesList/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gameId:"",
    list:[],
    gameName:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      gameId:options.id
    })
    this.getList()
  },
// 查询列表
getList(){
  wx.request({
    url: 'https://route.showapi.com/1698-3',
    data: {
      showapi_appid: "91711",
      showapi_sign: "40b423be4d1941e4b1f7cf30e9658b18",
      gameId:this.data.gameId
    },
    success:res=>{
      console.log(res)
      this.setData({
        gameName: res.data.showapi_res_body.name,
        list:res.data.showapi_res_body.strategyList
      })
    }
  })
}
})