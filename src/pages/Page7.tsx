import AIToolsHub from '../components/AIToolsHub';
import { getToolsForPage } from '../data/aiTools';

interface PageProps {
  onNavigate: (page: number) => void;
}

export default function Page7({ onNavigate }: PageProps) {
  return (
    <AIToolsHub
      tools={getToolsForPage(7)}
      pageNumber={7}
      onNavigate={onNavigate}
    />
  );
}
