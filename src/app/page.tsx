import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-row justify-center items-center w-full h-screen">
      <div className="flex flex-col justify-center items-center w-[300px] h-[200px] border-2 border-white text-white rounded">
        <Link href="/create">
          <p>Create Room (Storyteller)</p>
        </Link>
        <Link href="/join">
          <p>Join Room (Player)</p>
        </Link><Link href="/help">
          <p>Help</p>
        </Link>
      </div>
    </div>
  );
}
