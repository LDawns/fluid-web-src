<template>
    <el-row :gutter="20">
        <el-col :span="8" >
            <el-card :body-style="{ padding: '0px'}">
            <center><a href="https://kubernetes.io/"><el-image
                style="height: 100px"
                src="https://ldawns.github.io/test_fluid-web/imgs/k8sLogo.png"
                fit="scale-down"
                ></el-image></a></center>
            <br>
            <center><NavLink class="bigLink" :item= "K8sLink"/></center>
            </el-card>
        </el-col>
        <el-col :span="8" >
            <el-card :body-style="{ padding: '0px' }">
            <center><a href="https://www.docker.com/"><el-image
                style="height: 100px"
                src="https://ldawns.github.io/test_fluid-web/imgs/dokerLogo.png"
                fit="scale-down"
                ></el-image></a></center>
            <br>
            <center><NavLink class="bigLink" :item= "DokerLink"/></center>
            </el-card>
        </el-col>
        <el-col :span="8" >
            <el-card :body-style="{ padding: '0px' }">
            <center><a href="https://helm.sh/"><el-image
                style="height: 100px"
                src="https://ldawns.github.io/test_fluid-web/imgs/helm.png"
                fit="scale-down"
                ></el-image></a></center>
            <br>
            <center><NavLink class="bigLink" :item= "HelmLink"/></center>
            </el-card>
        </el-col>
    </el-row>
</template>


<script>
import NavLink from '@theme/components/NavLink.vue'
export default {
	components: { NavLink },

	computed:{
		K8sLink (){
      		return{
				link: "https://kubernetes.io/",
				text: "Kubernetes"
      		}
		},
		DokerLink (){
      		return{
				link: "https://www.docker.com/",
				text: "Doker"
      		}
		},
		HelmLink(){
			return{
				link: "https://helm.sh/",
				text: "Helm"
			}
		},
	}
	
}
</script>


<style scoped>
.bigLink{
    font-size: 1.23rem;
}
</style>