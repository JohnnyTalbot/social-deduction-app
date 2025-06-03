import {TextInput} from '@/components/ui/Input';
import Button from '@/components/ui/Button';

function JoinRoom() {
  return(
    <div className='flex flex-col justify-center items-center w-full h-screen'>
      <div>Join Room</div>
      <TextInput label="Your Name:" />
      <TextInput label="Room Code:" />
      <Button text="Enter" />
    </div>
  )
}

export default JoinRoom;