# SWR

`Stale-while-revalidate HTTP 캐시 무효화 전략`

SWR은 HTTP캐시로부터 데이터를 반환한 후 요청(fetch)을 하고, 최종적으로 최신의 데이터(업데이트)를 가져오는 전략
SWR을 사용하면 컴포넌트는 지속적이며 자동으로 데이터 업데이트 스트림을 받게 됩니다. 그리고 UI는 항상 빠르고 반응적

페이지 접근하면 SWR이 데이터를 불러오고 API 응답이 도착하면 그 데이터를 캐시에 저장
만일 다른 페이지에 갔다가 다시 돌아오면 SWR이 전에 받은 데이터를 보여주고
아무도 모르게 API에 새로운 데이터가 있는지 확인하는 이유는 데이터를 업데이트 할지 말지 체크하기 위해서 이다.
SWR이 API에 요청을 보내고 새로운 데이터가 있으면 업데이트함
그래서 항상 최신의 데이터를 확인할 수 있고, 페이지를 이동할 때마다 로딩 표시를 볼 필요가 없음

<br />

> ## 설치

<br />

```bash
npm i swr
```

<br />

> ## 적용하기

<br />

```tsx
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((response) => response.json());
export default () => {
  const { data } = useSWR("/api/user", fetcher);
  return <></>;
};
```

<br />

> ## 형태

<br />

```tsx
const fetcher = (url: string) => fetch(url).then((response) => response.json());
const { data, error } = useSWR(key, fetcher);
```

1.  ### fetcher 함수

    첫번쨰 인자에 url로 요청를 보내는 함수, 데이터를 불러오고, 그 데이터를 처리

2.  ### key

    - url이 api요청하면서 또한 캐시 저장할 때 사용할 key이기 때문에 key라는 용어를 사용

    - 데이터의 id 역할, url이 SWR 캐시의 key로 사용된다.
    - 다른페이지에서 `const { data } = useSWR("/api/user", fetcher)`를 요청하면 useSWR에서 해당 `api/user`의 키를 확인하고 거기에 맞는 캐시 데이터를 그 페이지로 보냄

    ```tsx
    SWR 캐시
    super_cache = {
      "/api/user": { ok: true, user: { age: 18, name: "tom" } },
    };
    ```

3.  ### data

    fetcher 함수가 리턴한 데이터는 data로 받음

4.  ### error

    fetcher 함수에 에러가 발생하면 error로 받음

<br />

> ## SWR 전역 설정

<br />

모든 SWR hook은 제공된 동일한 fetcher를 사용해 JSON 데이터를 로드

### local setting

```tsx
import useSWR from "swr";
const fetcher = (url: string) => fetch(url).then((response) => response.json());
export default () => {
  const { data } = useSWR("/api/users", fetcher);
  return <></>;
};
```

### global setting

fetcher함수를 `_app.tsx`에 선언

\_app.tsx

```tsx
import { SWRConfig } from "swr";

export default function App({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => fetch(url).then((response) => response.json()),
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}
```

index.tsx

```tsx
import useSWR from "swr";
export default () => {
  const { data, error } = useSWR("api/users");
  return (
    <>
      <div>{data}</div>
    </>
  );
};
```

user.tsx

```tsx
import useSWR from "swr";
const User () => {
  const { data, error } = useSWR("api/users");
  return(
     <>
        <div>{data}</div>
     </>
    );
};
export default User;
```

<br />

> ## mutation

즉시 내용이 변경되거나, 유저에게 변화를 반영해서 보여주고 싶을때 사용한다.
종류에는 `bounded mutation`과 `unbounded mutation`이 있다.

<br />

> ## bounded Mutation

<br />

해당 페이지에서 mutation할때 사용한다. 제한적

### 선언하기

```tsx
import useSWR from "swr";
const App = () => {
  const { data, mutate } = useSWR();

  const onClick = () => {
    mutate({ products: { name: "potato" } }, true);
  };
  return (
    <>
      <button onClick={onClick}>confirm</button>
      <p>{data?.product?.name}</p> //potato 출력
    </>
  );
};
```

### 형태

```tsx
mutate({ products: { name: "potato" } }, true);
```

첫번째 인자: 유저에게 화면 UI의 변경 사항을 보여줌, api 데이터가 첫번째 인자인 데이터로 변경
두번째 인자: 변경이 일어난 후 다시 API에서 데이터를 불러올지 결정 `true`면 불러오고 `false`면 api데이터를 불러오지 않고 첫번째 인자인 데이터가 계속 남음(revalidation(재검증))

<br />

> ## Unbounded Mutation

다른 페이지의 데이터를 mutation하고 싶을때 사용한다. 제한적이지 않음

 <br />

### 선언하기

```tsx
import useSWR, { useSWRConfig } from "swr";

const App = () => {
  const { mutate: unboundedMutate } = useSWRConfig();
  const { data, mutate: boundedMutate } = useSWR("api/users");
  const onClick = () => {
    boundedMutate({ ok: true }, true); // bounded Mutation
    unboundedMutate("api/products", { ok: true }, false); //unbounded Mutation, 다른 곳의 컴포넌트의 데이터를 mutation할때
  };
  return (
    <>
      <button onClick={onClick}>confirm</button>
      <p>{data?.product?.name}</p>
    </>
  );
};
```

### 형태

```tsx
mutate("api/products", { ok: true }, false);
```

첫번째 인자: 해당 api 키, 다른 페이지의 api 데이터 가져오려면 해당 url api키를 넣어주어야 함.
두번째 인자: 변경될 데이터
세번째 인자: 변경이 일어난 후 다시 API에서 데이터를 불러올지 결정 `true`면 불러오고 `false`면 api데이터를 불러오지 않고 첫번째 인자인 데이터가 계속 남음(revalidation(재검증))
