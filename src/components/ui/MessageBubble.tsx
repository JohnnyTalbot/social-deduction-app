
function MessageBubble(
  {className = '', text='', isSender=false, senderName='', ...props}: 
  {text: string, isSender: boolean, senderName: string}  & React.HTMLAttributes<HTMLDivElement>){
  return(
    <div className={`flex flex-col py-1 ${isSender ? 'ml-auto mr-1' : ''}`}>
      <p>{!isSender && senderName}</p>
      <div 
        className={`flex flex-col px-3 lg:px-4 lg:py-1 bg-input ${className}`}
        style={{
          background: '#F3ECDC',
          border: '2px solid #000000',
          boxShadow: '-3px 3px 0px #000000',
          borderRadius: isSender ? '30px 0px 30px 30px' : '0px 30px 30px 30px'
        }}
        {...props}
      >
        {text}
      </div>
    </div>
    
  )
}

export default MessageBubble;