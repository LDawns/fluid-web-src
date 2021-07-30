<template>
	<div class="demo" ref="demo">
		<el-row :gutter="20">
			<el-col :span=8>
				<el-card class="box-card">
				<div slot="header" class="clearfix">
				<center><NavLink :item= "DEMOLinkML"/></center>
				</div>
				<a 
					href="https://fluid-imgs.oss-cn-shanghai.aliyuncs.com/public/video/machineLearning.mp4" 
					target="_blank">
						<el-image 
							src="https://fluid-imgs.oss-cn-shanghai.aliyuncs.com/public/imgs/machineLearning.png" 
							fit="scale-down">
						</el-image>
				</a>
				</el-card>
			</el-col>
			<el-col :span=8>
				<el-card class="box-card">
				<div slot="header" class="clearfix">
				<center><NavLink :item= "DEMOLinkPVC"/></center>
				</div>
				<a 
					href="https://fluid-imgs.oss-cn-shanghai.aliyuncs.com/public/video/accelerate_pvc.mp4" 
					target="_blank">
						<el-image 
							src="https://fluid-imgs.oss-cn-shanghai.aliyuncs.com/public/imgs/accelerate_pvc.jfif" 
							fit="scale-down">
						</el-image>
				</a>
				</el-card>
			</el-col>
			<el-col :span=8>
				<el-card class="box-card">
				<div slot="header" class="clearfix">
				<center><NavLink :item= "DEMOLinkWarm"/></center>
				</div>
				<a 
					href="https://fluid-imgs.oss-cn-shanghai.aliyuncs.com/public/video/dataWarmup.mp4" 
					target="_blank">
						<el-image 
							src="https://fluid-imgs.oss-cn-shanghai.aliyuncs.com/public/imgs/dataWarmup.jfif" 
							fit="scale-down">
						</el-image>
				</a>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>
<script>
import NavLink from '@theme/components/NavLink.vue'
export default {
	components: { NavLink },

	computed:{
		DEMOLinkML (){
      		return{
				link: "/samples/machinelearning",
				text: "Machine Learning"
      		}
		},
		DEMOLinkPVC(){
			return{
				link: "/samples/accelerate_pvc",
				text: "Accelerate PVC"
			}
		},
		DEMOLinkWarm(){
			return{
				link: "/samples/data_warmup",
				text: "Data Warmup"
			}
		}
	}
	
}
</script>

