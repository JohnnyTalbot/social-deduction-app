"use client";

import Link from 'next/link';

import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ModelPreload from '@/components/ModelPreload';

export default function Home() {
  return (
    <div className="flex flex-col justify-between items-center w-full h-screen">
      <ModelPreload />
      <div>
        <h1 className='text-8xl text-purple-dark text-center'>Blood on the Clocktower</h1>
      </div>
      <Card className="relative flex flex-col justify-center items-center gap-10 px-20 py-20">
        <Link href="/create">
          <Button className='w-[250px]'>
            <p className='text-5xl'>Create Room</p>
            <p className='text-2xl'>(Storyteller)</p>
          </Button>
        </Link>
        <Link href="/join">
          <Button className='w-[250px]'>
            <p className='text-5xl'>Join Room</p>
            <p className='text-2xl'>(Player)</p>
          </Button>
        </Link>
        <div className='absolute w-full flex justify-end bottom-0 right-0 p-5'>
          <Link href="/help">
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12.5 25C19.4036 25 25 19.4036 25 12.5C25 5.59644 19.4036 0 12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4036 5.59644 25 12.5 25ZM12.5 7.5C10.9555 7.5 10 8.71339 10 10C10 10.6904 9.44036 11.25 8.75 11.25C8.05964 11.25 7.5 10.6904 7.5 10C7.5 7.53661 9.37929 5 12.5 5C15.6207 5 17.5 7.53661 17.5 10C17.5 12.5587 15.5705 13.9248 14.934 14.243C14.8389 14.2906 14.7326 14.3358 14.6581 14.3674L14.625 14.3815C14.5506 14.4131 14.4821 14.4422 14.4092 14.475C14.2432 14.5497 14.0994 14.6244 13.9812 14.7058C13.75 14.8651 13.75 14.9458 13.75 15C13.75 15.6904 13.1904 16.25 12.5 16.25C11.8096 16.25 11.25 15.6904 11.25 15C11.25 13.8042 11.9677 13.0571 12.5629 12.6471C12.8584 12.4436 13.1557 12.2977 13.3827 12.1955C13.5502 12.12 13.6352 12.0852 13.6932 12.0613C13.7419 12.0413 13.7719 12.029 13.816 12.007C13.8852 11.9723 14.2074 11.7717 14.5002 11.4042C14.7772 11.0563 15 10.5969 15 10C15 8.71339 14.0445 7.5 12.5 7.5ZM12.5 18.75C11.8096 18.75 11.25 19.3096 11.25 20C11.25 20.6904 11.8096 21.25 12.5 21.25C13.1904 21.25 13.75 20.6904 13.75 20C13.75 19.3096 13.1904 18.75 12.5 18.75Z" fill="#51277D"/>
            </svg>
          </Link>
        </div>
      </Card>
      <div>
        <p className='text-roboto'>Designed and Developed by Jonathan Talbot</p>
      </div>
    </div>
  );
}
