import { createRouter, createWebHistory } from 'vue-router';
import InterviewScreen from '../components/InterviewScreen.vue';
import InterviewListScreen from '../components/InterviewListScreen.vue';
import AddInterviewScreen from '../components/AddInterviewScreen.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: InterviewScreen,
  },
  {
    path: '/interview/:id',
    name: 'Interview',
    component: InterviewScreen,
  },
  {
    path: '/interview-list',
    name: 'InterviewList',
    component: InterviewListScreen,
  },
  {
    path: '/add-interview',
    name: 'AddInterview',
    component: AddInterviewScreen,
  },
  { path: '/edit-interview/:id', 
    name: 'EditInterview', 
    component: AddInterviewScreen, 
    props: true 
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
