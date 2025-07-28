const SuccessMessage = ({ message }) => {
    if (message === null) {
        return null
    }


    return (

        <div className="success">
            {message}
            <img className={'successImg'} alt={'error'} src={require('@/assets/success.png')}/>
        </div>

    )
}



export default SuccessMessage