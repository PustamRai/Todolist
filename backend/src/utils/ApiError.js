class ApiError extends Error{
    constructor(
        statusCode,
        message = "something went wrong",
        errors = []
    ) {
        super(message);
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.errors = errors
        this.success = false
    }
}

export { ApiError }