import { isRouteErrorResponse, Link, useRouteError } from 'react-router';

export function RouteError() {
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <p style={{ fontSize: '4rem' }} aria-hidden="true">
        {notFound ? '🔍' : '🙈'}
      </p>
      <h1>{notFound ? 'No encontramos esta página' : 'Algo salió mal'}</h1>
      <p style={{ margin: '16px 0 24px' }}>
        <Link to="/">Volver al inicio</Link>
      </p>
    </div>
  );
}
