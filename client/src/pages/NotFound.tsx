import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import SectionTitle from '../components/ui/SectionTitle';

export default function NotFound() {
  return (
    <div className="space-y-6">
      <SectionTitle
        title="404"
        subtitle="Страница не найдена"
      />

      <Card className="max-w-xl">
        <p className="mb-4 text-slate-300">
          Такой страницы нет. Вернись на главную и продолжай работу с приложением.
        </p>

        <Link to="/">
          <Button>На главную</Button>
        </Link>
      </Card>
    </div>
  );
}