module.exports = {
    verifica_admin: (request, response, next) => {
        if (request.isAuthenticated() && request.user.admin == '1') {
            return next()
        } else {
            request.flash('error_msg', 'você deve ser admin para entrar')
            response.redirect('/')
        }
    }
}