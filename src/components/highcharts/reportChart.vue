<template>
    <div>
        <div class="highcharts-container"></div>
    </div>
</template>

<script>
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import Highcharts3D from 'highcharts/highcharts-3d';
HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);

export default {
  props: ['options', 'styles'],
  name: 'highcharts',
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
        this.$el.style.width = '100%';
        this.$el.style.height = (this.styles.height || 280) + 'px';
        this.chart = new Highcharts.Chart(this.$el, this.options);
    }
  }
}
</script>

<style>
  .highcharts-container {
    width: 100%;
    height: 400px;
  }
</style>