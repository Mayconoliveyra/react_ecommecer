import { signIn, signOut, useSession } from 'next-auth/client';

export function SignInButton() {
  const [session] = useSession();

  return session ? (
    <button
      type="button"
      onClick={() => signOut()}
    >
      <img src={session.user.image} alt="Foto do usuario" />
      Olá {session.user.name}

    </button>
  ) : (
    <button
      type="button"

      onClick={() => signIn('github')}
    >
      Entrar com github
    </button>
  )
}