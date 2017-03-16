/* 开发环境路由配置文件 */
var routers = {
	//index
	"/index/user":{method:"get", file:"data/index/user.json"},
	"/index/save":{method:"post", file:"data/index/save-success.json"},//"index/save-fail.json"
}
module.exports = routers;