import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Failure } from '../error/failure';
import { useAuthStore } from '../../features/auth/presentation/store/auth_store';
import { GetMyStatsUseCase } from '../../features/user/application/usecases/get_my_stats_usecase';
import { GetMyStatsRepositoryImpl } from '../../features/user/data/repositories/get_my_stats_repository_impl';
import type { MyStats } from '../../features/user/domain/entities/my_stats';

export function useMyStats() {
  const auth = useAuthStore();
  const getMyStats = new GetMyStatsUseCase(new GetMyStatsRepositoryImpl());
  const currentYear = new Date().getFullYear();
  const years = [String(currentYear), String(currentYear - 1), String(currentYear - 2)];
  const year = ref(String(currentYear));
  const data = ref<MyStats | null>(null);
  const loading = ref(true);
  const error = ref('');
  const chartLoading = ref(false);
  const chartError = ref('');
  let requestId = 0;

  const stats = computed(() => {
    if (!data.value) return [];

    return [
      { label: 'Événements créés', value: data.value.statistics.events, icon: 'calendar' },
      { label: 'Photos ajoutées', value: data.value.statistics.photos, icon: 'picture' },
      { label: 'Vidéos ajoutées', value: data.value.statistics.videos, icon: 'video-camera-alt' },
      { label: 'Total médias', value: data.value.statistics.total_media, icon: 'layers' },
    ];
  });

  const events = computed(() => {
    if (!data.value) return [];
    return data.value.events;
  });

  async function loadStats() {
    const currentRequest = ++requestId;
    loading.value = true;
    error.value = '';
    chartLoading.value = false;
    chartError.value = '';
    data.value = null;

    const result = await getMyStats.execute({
      token: auth.session?.token ?? '',
      year: Number(year.value),
    });

    if (currentRequest !== requestId) return;
    loading.value = false;

    if (result instanceof Failure) {
      error.value = result.message;
      return;
    }

    data.value = result;
  }

  async function loadChart() {
    if (!data.value) {
      await loadStats();
      return;
    }

    const currentRequest = ++requestId;
    chartLoading.value = true;
    chartError.value = '';

    const result = await getMyStats.execute({
      token: auth.session?.token ?? '',
      year: Number(year.value),
    });

    if (currentRequest !== requestId) return;
    chartLoading.value = false;

    if (result instanceof Failure) {
      chartError.value = result.message;
      return;
    }

    data.value.events_by_month = result.events_by_month;
  }

  onMounted(loadStats);
  watch(year, loadChart);
  watch(() => auth.session?.token, loadStats);

  onBeforeUnmount(() => {
    requestId++;
  });

  return { data, stats, events, year, years, loading, error, chartLoading, chartError, loadStats, loadChart };
}
