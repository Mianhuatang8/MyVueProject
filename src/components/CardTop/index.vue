<template>
  <div class="oneCardAll">
    <el-card>
      <Detail title="总销售额" count="￥126560" style="width:250px">
        <!-- 插入图标 -->
        <template #center>
          <p>
            周同比：56.67%
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728="" color="green" width="16"
              height="16">
              <path fill="currentColor"
                d="M572.235 205.282v600.365a30.118 30.118 0 1 1-60.235 0V205.282L292.382 438.633a28.913 28.913 0 0 1-42.646 0 33.43 33.43 0 0 1 0-45.236l271.058-288.045a28.913 28.913 0 0 1 42.647 0L834.5 393.397a33.43 33.43 0 0 1 0 45.176 28.913 28.913 0 0 1-42.647 0l-219.618-233.23z">
              </path>
            </svg>
          </p>
          <p>
            日同比：19.96%
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728="" color="red" width="16"
              height="16">
              <path fill="currentColor"
                d="M544 805.888V168a32 32 0 1 0-64 0v637.888L246.656 557.952a30.72 30.72 0 0 0-45.312 0 35.52 35.52 0 0 0 0 48.064l288 306.048a30.72 30.72 0 0 0 45.312 0l288-306.048a35.52 35.52 0 0 0 0-48 30.72 30.72 0 0 0-45.312 0L544 805.824z">
              </path>
            </svg>
          </p>
        </template>
        <!-- 底部内容 -->
        <template #footer>
          <span>日销售额：￥12423</span>
        </template>
      </Detail>
    </el-card>

    <el-card>
      <Detail title="访问量" count="88460">
        <!-- 插入图表 -->
        <template #center>
          <LineChart style="height:50px;width:250px;"></LineChart>
        </template>
        <!-- 底部内容 -->
        <template #footer>
          <span>日访问量：1234</span>
        </template>
      </Detail>
    </el-card>
    <el-card>
      <Detail title="支付笔数" count="88460">
        <!-- 插入图标 -->
        <template #center>
          <BarChart style="height:50px;width:250px;"></BarChart>
        </template>
        <!-- 底部内容 -->
        <template #footer>
          <span>转化率：64%</span>
        </template>
      </Detail>
    </el-card>
    <el-card>
      <Detail title="运营活动效果" count="78%"   style="width:250px">
        <!-- 插入图标 -->
        <template #center>
          <el-progress :percentage="78" />
        </template>
        <!-- 底部内容 -->
        <template #footer>
          <p>
            周同比：56.67%
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728="" color="green" width="16"
              height="16">
              <path fill="currentColor"
                d="M572.235 205.282v600.365a30.118 30.118 0 1 1-60.235 0V205.282L292.382 438.633a28.913 28.913 0 0 1-42.646 0 33.43 33.43 0 0 1 0-45.236l271.058-288.045a28.913 28.913 0 0 1 42.647 0L834.5 393.397a33.43 33.43 0 0 1 0 45.176 28.913 28.913 0 0 1-42.647 0l-219.618-233.23z">
              </path>
            </svg>
          </p>
          <p>
            日同比：19.96%
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728="" color="red" width="16"
              height="16">
              <path fill="currentColor"
                d="M544 805.888V168a32 32 0 1 0-64 0v637.888L246.656 557.952a30.72 30.72 0 0 0-45.312 0 35.52 35.52 0 0 0 0 48.064l288 306.048a30.72 30.72 0 0 0 45.312 0l288-306.048a35.52 35.52 0 0 0 0-48 30.72 30.72 0 0 0-45.312 0L544 805.824z">
              </path>
            </svg>
          </p>
        </template>
      </Detail>
    </el-card>
  </div>
</template>

<script>
import BarChart from '../CardTop/BarChart/index.vue'
import LineChart from '../CardTop/LineChart/index.vue'
import Detail from '../CardTop/Detail/index.vue'
export default {
  components: { Detail, LineChart, BarChart },

}
</script>

<style scope>
.oneCardAll {
  display: flex;
  justify-content: space-between;
  margin-top: 70px;
  margin-left: 30px;
  margin-right: 30px;
}
</style>