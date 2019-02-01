import Vue from 'vue'
import Router from 'vue-router'
import PublicIndex from '@/components/PublicIndex'
import CompetitorView from '@/components/CompetitorView'
import JudgeView from '@/components/JudgeView'
import SquareView from '@/components/SquareView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PublicIndex',
      component: PublicIndex
    },
    {
      path: '/competitor',
      name: 'CompetitorView',
      component: CompetitorView
    },
    {
      path: '/judge',
      name: 'JudgeView',
      component: JudgeView
    },
    {
      path: '/square',
      name: 'SquareView',
      component: SquareView
    },
  ]
})
