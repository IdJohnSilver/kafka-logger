import { check } from 'k6';
import http from 'k6/http';

export default function () {
  const res = http.get('https://videoserver.t2m.kz/rtc/info');
  check(res, {
    'is status 400': (r) => r.status === 400,
  });
}
