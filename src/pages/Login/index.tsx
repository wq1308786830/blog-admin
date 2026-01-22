import NormalLoginForm from './NormalLoginForm';

function Login() {
  return (
    <div className="min-h-screen gradient-bg">
      <div className="back-img flex items-center justify-end min-h-screen p-8">
        <div className="w-[350px]">
          <div className="Card bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6">
            <NormalLoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
