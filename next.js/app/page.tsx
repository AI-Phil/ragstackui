import Menu from './components/Menu'; // Adjust the path as necessary

export default function Home() {
  return (
    <div>
      <Menu />
      <div className="flex h-screen justify-center items-center">
        <h1 className="text-4xl font-bold">Hello, World!</h1>
      </div>
    </div>
  );
}
