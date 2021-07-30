<template>
	<div class="community">
		<el-row :gutter="20">
			<el-col :span=6>
				<el-card class="box-card">
				<div slot="header" class="clearfix">
				<center><el-image class="iconImg"
                        style="height: 36px"
                        src = "https://fluid-imgs.oss-cn-shanghai.aliyuncs.com/public/imgs/wechat-icon.png"
                        fit = "scale-down"
                        ></el-image></center>
                <br>
                <center>WeChat Group</center>
				</div>
                <center><el-image class="codeImg"
                        style="height: 100px"
                        src = "https://fluid-imgs.oss-cn-shanghai.aliyuncs.com/public/imgs/wx_code.png"
                        fit = "scale-down"
                        ></el-image></center>
				</el-card>
			</el-col>

            <el-col :span=6>
				<el-card class="box-card">
				<div slot="header" class="clearfix">
				<center><el-image class="iconImg"
                        style="height: 36px"
                        src = "https://fluid-imgs.oss-cn-shanghai.aliyuncs.com/public/imgs/wechat-icon.png"
                        fit = "scale-down"
                        ></el-image></center>
                <br>
                <center>WeChat Official Account</center>
				</div>
                <center><el-image class="codeImg"
                        style="height: 100px"
                        src = "https://fluid-imgs.oss-cn-shanghai.aliyuncs.com/public/imgs/wxgzh_code.png"
                        fit = "scale-down"
                        ></el-image></center>
				</el-card>
			</el-col>

            <el-col :span=6>
				<el-card class="box-card">
				<div slot="header" class="clearfix">
				<center><el-image class="iconImg"
                        style="height: 36px"
                        src = "https://fluid-imgs.oss-cn-shanghai.aliyuncs.com/public/imgs/dinging-icon.jpg"
                        fit = "scale-down"
                        ></el-image></center>
                <br>
                <center>DingDing Talk</center>
				</div>
                <center><el-image class="codeImg"
                        style="height: 100px"
                        src = "https://fluid-imgs.oss-cn-shanghai.aliyuncs.com/public/imgs/dingding_code.png"
                        fit = "scale-down"
                        ></el-image></center>
				</el-card>
			</el-col>

            <el-col :span=6>
				<el-card class="box-card">
				<div slot="header" class="clearfix">
				<center><el-image class="iconImg"
                        style="height: 36px"
                        src = "https://fluid-imgs.oss-cn-shanghai.aliyuncs.com/public/imgs/git-icon.png"
                        fit = "scale-down"
                        ></el-image></center>
                <br>
                <center>G I T H U B</center>
				</div>
                    <center><el-button style="height:100px;width:100px;font-size:16px" type="primary" onclick="window.open('https://github.com/fluid-cloudnative/fluid','_blank')">
                        <center>Join Us</center>
                    </el-button></center>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>
<script>
export default {
	computed:{
	}
	
}
</script>

