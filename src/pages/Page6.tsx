import AIToolsHub from '../components/AIToolsHub';
import { getToolsForPage } from '../data/aiTools';

interface PageProps {
  onNavigate: (page: number) => void;
  onOpenAssetPage: (toolName: string, mode: 'upload' | 'create') => void;
}

export default function Page6({ onNavigate, onOpenAssetPage }: PageProps) {
  return (
    <AIToolsHub
      tools={getToolsForPage(6)}
      pageNumber={6}
      onNavigate={onNavigate}
      onOpenAssetPage={onOpenAssetPage}
    />
  );
}
