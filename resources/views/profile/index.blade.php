@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">{{ __('Mi Perfil') }}</div>

                <div class="card-body">
                    <form id="profileForm">
                        @csrf
                        
                        <div class="alert alert-success d-none" id="profileSuccess">
                            Perfil actualizado correctamente
                        </div>
                        
                        <div class="alert alert-danger d-none" id="profileError">
                            Error al actualizar el perfil
                        </div>

                        <div class="row mb-3">
                            <label for="name" class="col-md-4 col-form-label text-md-end">{{ __('Nombre') }}</label>

                            <div class="col-md-6">
                                <input id="name" type="text" class="form-control" name="name" required autofocus>
                            </div>
                        </div>

                        <div class="row mb-3">
                            <label for="email" class="col-md-4 col-form-label text-md-end">{{ __('Email') }}</label>

                            <div class="col-md-6">
                                <input id="email" type="email" class="form-control" name="email" required readonly>
                            </div>
                        </div>
                        
                        <div class="row mb-3">
                            <label for="role" class="col-md-4 col-form-label text-md-end">{{ __('Rol') }}</label>

                            <div class="col-md-6">
                                <input id="role" type="text" class="form-control" readonly>
                            </div>
                        </div>

                        <div class="row mb-3">
                            <label for="password" class="col-md-4 col-form-label text-md-end">{{ __('Nueva Contraseña') }}</label>

                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control" name="password">
                                <small class="form-text text-muted">Dejar en blanco si no desea cambiar la contraseña</small>
                            </div>
                        </div>

                        <div class="row mb-3">
                            <label for="password_confirmation" class="col-md-4 col-form-label text-md-end">{{ __('Confirmar Contraseña') }}</label>

                            <div class="col-md-6">
                                <input id="password_confirmation" type="password" class="form-control" name="password_confirmation">
                            </div>
                        </div>

                        <div class="row mb-0">
                            <div class="col-md-6 offset-md-4">
                                <button type="submit" class="btn btn-primary">
                                    {{ __('Actualizar Perfil') }}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del perfil
    fetch('/api/profile', {
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('name').value = data.data.name;
            document.getElementById('email').value = data.data.email;
            document.getElementById('role').value = data.data.role;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
    // Manejar envío del formulario
    const form = document.getElementById('profileForm');
    const successAlert = document.getElementById('profileSuccess');
    const errorAlert = document.getElementById('profileError');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Ocultar alertas
        successAlert.classList.add('d-none');
        errorAlert.classList.add('d-none');
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            password: formData.get('password') || null,
            password_confirmation: formData.get('password_confirmation') || null
        };
        
        // Si la contraseña está vacía, no la enviamos
        if (!data.password) {
            delete data.password;
            delete data.password_confirmation;
        }
        
        fetch('/api/profile/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                successAlert.classList.remove('d-none');
                // Limpiar campos de contraseña
                document.getElementById('password').value = '';
                document.getElementById('password_confirmation').value = '';
            } else {
                errorAlert.textContent = data.message || 'Error al actualizar el perfil';
                errorAlert.classList.remove('d-none');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorAlert.textContent = 'Error al comunicarse con el servidor';
            errorAlert.classList.remove('d-none');
        });
    });
});
</script>
@endsection
