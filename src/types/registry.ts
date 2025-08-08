import type { AlgoCategory, AlgoDescriptor, AlgoModule } from '@/types/step';

export interface AlgoListItem {
  id: string;
  category: AlgoCategory;
  title: string;
}

export type AlgoModuleLoader = () => Promise<AlgoModule<any>>;

export interface DynamicRegistry {
  descriptors: AlgoDescriptor<any>[];
  loaders: Record<string, AlgoModuleLoader>;
}
