import AIToolsHub from '../components/AIToolsHub';
import { getToolsForPage } from '../data/aiTools';

interface PageProps {
  onNavigate: (page: number) => void;
  onOpenAssetPage: (toolName: string, mode: 'upload' | 'create') => void;
}

export default function Page4({ onNavigate, onOpenAssetPage }: PageProps) {
  return (
    <AIToolsHub
      tools={getToolsForPage(4)}
      pageNumber={4}
      onNavigate={onNavigate}
      onOpenAssetPage={onOpenAssetPage}
    />
  );
}
