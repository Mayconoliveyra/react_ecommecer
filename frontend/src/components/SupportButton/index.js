import Link from 'next/link';

export function SupportButton() {
  return (
    <div >
      <Link href="/donate">
        <button>Apoiar</button>
      </Link>
    </div>
  )
}