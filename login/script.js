// Minimal Login Form JavaScript
class MinimalLoginForm {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.passwordToggle = document.getElementById('passwordToggle');
        this.submitButton = this.form.querySelector('.login-btn');
        this.successMessage = document.getElementById('successMessage');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupPasswordToggle();
    }
    
    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.passwordInput.addEventListener('input', () => this.clearError('password'));
    }
    
    setupPasswordToggle() {
        this.passwordToggle.addEventListener('click', () => {
            const type = this.passwordInput.type === 'password' ? 'text' : 'password';
            this.passwordInput.type = type;
            
            const icon = this.passwordToggle.querySelector('.toggle-icon');
            icon.classList.toggle('show-password', type === 'text');
        });
    }
    
    validateEmail() {
    const result = FormUtils.validateEmail(this.emailInput.value.trim());
    if (!result.isValid) {
        FormUtils.showError('email', result.message);
        return false;
    }
    FormUtils.clearError('email');
    return true;
}
    validatePassword() {
    const result = FormUtils.validatePassword(this.passwordInput.value.trim());
    if (!result.isValid) {
        FormUtils.showError('password', result.message);
        return false;
    }
    FormUtils.clearError('password');
    return true;
}
    
    showError(field, message) {
        const formGroup = document.getElementById(field).closest('.form-group');
        const errorElement = document.getElementById(`${field}Error`);
        
        formGroup.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    clearError(field) {
        const formGroup = document.getElementById(field).closest('.form-group');
        const errorElement = document.getElementById(`${field}Error`);
        
        formGroup.classList.remove('error');
        errorElement.classList.remove('show');
        setTimeout(() => {
            errorElement.textContent = '';
        }, 200);
    }
    
async handleSubmit(e) {
    e.preventDefault();

    const isEmailValid = this.validateEmail();
    const isPasswordValid = this.validatePassword();

    if (!isEmailValid || !isPasswordValid) {
        return;
    }

    this.setLoading(true);

    try {
        // Initialize Supabase
        const supabase = window.supabase.createClient(
            "https://hzjtqrpbdydwjampnfkx.supabase.co",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6anRxcnBiZHlkd2phbXBuZmt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNTE3ODEsImV4cCI6MjA3NDgyNzc4MX0.7xZMOgG41irpm6bPnjiKqZrejnvzAMm6bsOZtloeWGs"
        );

        // Try to sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email: this.emailInput.value.trim(),
            password: this.passwordInput.value.trim()
        });

        if (error) {
            FormUtils.showError("password", error.message);
            return;
        }

        // Success
        this.showSuccess();
    } catch (err) {
        FormUtils.showError("password", "Something went wrong. Please try again.");
    } finally {
        this.setLoading(false);
    }
}
    
    setLoading(loading) {
        this.submitButton.classList.toggle('loading', loading);
        this.submitButton.disabled = loading;
    }
    
    showSuccess() {
        this.form.style.display = 'none';
        this.successMessage.classList.add('show');
        
        // Simulate redirect after 2 seconds
        setTimeout(() => {
            console.log('Redirecting to dashboard...');
            window.location.href = 'dashboard/dashboard.html';
        }, 2000);
    }
}

// Initialize the form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MinimalLoginForm();

    FormUtils.addSharedAnimations();
    FormUtils.setupPasswordToggle(
    document.getElementById('password'),
    document.getElementById('passwordToggle')
    );
    FormUtils.setupFloatingLabels(document.getElementById('loginForm'));
});