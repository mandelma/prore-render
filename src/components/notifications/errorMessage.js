const ErrorMessage = ({ message }) => {
    if (message === null) {
        return null
    }

    return (

        <div className="error">
            {message}
            <img className={'errorImg'} alt={'error'} src={require('@/assets/error.png')}/>

        </div>

    )
}

export default ErrorMessage