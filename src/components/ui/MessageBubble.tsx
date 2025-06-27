
function MessageBubble(
  {className = '', text='', sender=false, senderName='', ...props}: 
  {text: string, sender: boolean, senderName: string}  & React.HTMLAttributes<HTMLDivElement>){
  return(
    <div className={`flex flex-col py-1 ${sender ? 'ml-auto mr-1' : ''}`}>
      <p>{senderName}</p>
      <div 
        className={`flex flex-col px-4 py-1 bg-input ${className}`}
        style={{
          background: '#F3ECDC',
          border: '2px solid #000000',
          boxShadow: '-3px 3px 0px #000000',
          borderRadius: sender ? '30px 0px 30px 30px' : '0px 30px 30px 30px'
        }}
        {...props}
      >
        {text}
      </div>
    </div>
    
  )
}

export default MessageBubble;