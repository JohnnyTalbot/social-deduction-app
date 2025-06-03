import {TextInput, NumberInput} from '@/components/ui/Input';
import Button from '@/components/ui/Button';

function CreateRoom() {
  return(
    <div className='flex flex-col justify-center items-center w-full h-screen'>
      <div>Create Room</div>
      <TextInput label="Room Name:" />
      <NumberInput label="Number of players:" min={4} max={12} />
      <Button text="Create" />
    </div>
  )
}

export default CreateRoom;