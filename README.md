# g2rain-infra-app

## 1. 寰芥爣涓庣姸鎬佹爣璇?
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22-5FA04E?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vue](https://img.shields.io/badge/Vue-3.5.26-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![qiankun](https://img.shields.io/badge/qiankun-2.10.16-1f6feb)](https://qiankun.umijs.org/)

## 2. 椤圭洰绠€浠?
`g2rain-infra-app` 鏄?G2rain 骞冲彴涓殑鍩虹璁炬柦涓庡钩鍙拌兘鍔涘墠绔瓙搴旂敤锛岃礋璐ｆ壙杞藉瓧鍏搞€佸浗闄呭寲鏂囨銆佸尯鍩熻缃€佸钩鍙伴洦婊撮厤缃瓑鍩虹绠＄悊椤甸潰锛屽苟涓哄钩鍙扮骇閰嶇疆涓庡叡浜兘鍔涙彁渚涚粺涓€鐨勫墠绔氦浜掑叆鍙ｃ€?
## 3. 骞冲彴瀹氫綅

鍦?G2rain鈥滀紒涓氱骇 AI 鍘熺敓寮€婧?SaaS 骞冲彴鈥濅綋绯讳腑锛宍g2rain-infra-app` 浣嶄簬骞冲彴鎺у埗鍙板瓙搴旂敤灞傦紝鏄钩鍙板熀纭€璁炬柦绫昏兘鍔涚殑鍓嶇鎵胯浇搴旂敤銆?
瀹冧富瑕佹湇鍔′互涓嬪満鏅細
- 涓哄钩鍙拌繍缁淬€佷骇鍝佷笌瀹炴柦浜哄憳鎻愪緵鍩虹閰嶇疆涓庡叡浜兘鍔涚殑绠＄悊鐣岄潰
- 涓?`g2rain-infra` 绛夊熀纭€璁炬柦鏈嶅姟鎻愪緵瀵瑰簲鐨勫墠绔氦浜掑眰
- 鍦ㄥ紑鍙戦樁娈垫敮鎸佺嫭绔嬭繍琛岃皟璇曪紝鍦ㄨ仈璋冧笌浜や粯闃舵鎺ュ叆 `g2rain-main-shell`
- 閫氳繃 OpenResty + Lua 涓庣粺涓€璁よ瘉浣撶郴鍗忓悓锛屾瀯鎴愬瓙搴旂敤鐨勫畬鏁磋韩浠界鐞嗛摼璺?
瀹冧笌 `g2rain-infra`銆乣g2rain-main-shell`銆乣g2rain-basis`銆乣g2rain-iam` 鍗忓悓宸ヤ綔銆?
## 4. 鏍稿績鑳藉姏

鏈珷鍥炵瓟鈥滆繖涓粨搴撳湪骞冲彴閲屾彁渚涗粈涔堣兘鍔涖€佽В鍐充粈涔堥棶棰樷€濄€?
- 骞冲彴鍩虹閰嶇疆椤甸潰鎵胯浇鑳藉姏锛氳В鍐冲钩鍙板瓧鍏搞€佹枃妗堛€佸尯鍩熻缃瓑鍩虹鑳藉姏鐨勫彲瑙嗗寲缁存姢闂锛岄€氳繃 `src/views` 涓殑鍩虹璁炬柦椤甸潰鎻愪緵缁熶竴浜や簰鍏ュ彛銆?- 鍙屾ā寮忚繍琛岃兘鍔涳細瑙ｅ喅鐙珛寮€鍙戜笌涓诲３鑱旇皟涔嬮棿鐨勫垏鎹㈤棶棰橈紝閫氳繃 `VITE_RUN_MODE`銆乹iankun 鐢熷懡鍛ㄦ湡涓庝富澹宠烦杞€昏緫鏀拺涓ょ杩愯妯″紡銆?- 璧勬簮椹卞姩璺敱瑁呰浇鑳藉姏锛氳В鍐冲钩鍙板簲鐢ㄨ祫婧愩€佽彍鍗曚笌椤甸潰璺敱鐨勭粺涓€瑁呰浇闂锛岄€氳繃杩愯鏃惰祫婧愬姞杞藉拰鍔ㄦ€佽矾鐢辩敓鎴愭寜骞冲彴璧勬簮瀹氫箟椹卞姩椤甸潰璁块棶銆?- 缁熶竴璁よ瘉涓庣鍚嶅崗鍚岃兘鍔涳細瑙ｅ喅骞冲彴鍩虹瀛愬簲鐢ㄧ殑 SSO銆佺鍚嶅拰鎺ュ彛璁块棶瀹夊叏闂锛岄€氳繃 IAM 鍏挜鑾峰彇銆丩ua 绛惧悕涓庤繍琛屾椂 SSO 娴佺▼瀹屾垚瀹夊叏鎺ュ叆銆?- 浠ｇ爜鐢熸垚涓庤祫婧愰厤缃兘鍔涳細瑙ｅ喅鏍囧噯 CRUD 椤甸潰鍒濆鍖栦笌璧勬簮瀵煎叆闂锛岄€氳繃 `build:generate` 鍜?`build:config` 鏀拺蹇€熸墿灞曘€?- OpenResty 浜や粯鑳藉姏锛氳В鍐冲墠绔瓙搴旂敤榛樿杩愯鐜鍜岄儴缃叉柟寮忕粺涓€鐨勯棶棰橈紝閫氳繃 `Dockerfile`銆乣nginx`銆乣lua`銆乣build.sh` 鎻愪緵鏍囧噯浜や粯鍏ュ彛銆?
## 5. 鎶€鏈爤

- 璇█涓庤繍琛屾椂锛歚TypeScript`銆乣Node.js 22+`
- 鍓嶇妗嗘灦锛歚Vue 3.5.26`銆乣Vue Router 4.6.4`銆乣Pinia 3.0.4`
- 鏋勫缓宸ュ叿锛歚Vite 7.3.0`銆乣vue-tsc 3.2.1`
- 寰墠绔細`qiankun 2.10.16`銆乣vite-plugin-qiankun 1.0.15`
- UI 涓庝氦浜掞細`Element Plus 2.13.0`
- 鍥介檯鍖栵細`vue-i18n 11.4.4`
- 璋冭瘯涓庢ā鎷燂細`vite-plugin-mock`銆乣mockjs`
- 瀹夊叏涓庣鍚嶏細`jose`銆乣elliptic`銆乣crypto-js`
- 浜や粯涓庤繍琛岋細`Dockerfile`銆乣OpenResty`銆乣nginx`銆乣lua`銆乣build.sh`

## 6. 蹇€熷紑濮?
### 鐜瑕佹眰

- `Node.js 22+`
- `npm 10+`
- 鍙仈閫氱殑鍚庣鏈嶅姟涓庣粺涓€璁よ瘉鐜
- 濡傞渶闀滃儚鏋勫缓锛岄渶鍙敤鐨?`Docker`

### 鍏抽敭鐜鍙橀噺

| 鍙橀噺鍚?| 璇存槑 | 鍏稿瀷鐢ㄩ€?|
| --- | --- | --- |
| `VITE_APPLICATION_CODE` | 搴旂敤缂栫爜 | 褰撳墠鍊?`g2rain-infra-app` |
| `VITE_CONTEXT_PATH` | 閮ㄧ讲涓婁笅鏂囪矾寰?| 褰撳墠鍊?`/infra` |
| `VITE_BACKEND_ORIGIN` | 鍚庣鏈嶅姟鍦板潃 | 鏈湴浠ｇ悊鐩爣 |
| `VITE_TOKEN_END_POINT` | Token 鎺ュ彛璺緞 | 榛樿 `/auth/token` |
| `VITE_AUTH_END_POINT` | 鎺堟潈鎺ュ彛璺緞 | 榛樿 `/auth/authorize` |
| `VITE_SERVER_PORT` | 鏈湴寮€鍙戠鍙?| 褰撳墠鍊?`3000` |
| `VITE_SSO_BASE_URL` | SSO 鏍瑰湴鍧€ | 鐧诲綍璺宠浆涓庡洖璋?|
| `VITE_REDIRECT_URI` | 鍥炶皟璺緞 | 榛樿 `/sso_callback` |
| `VITE_RUN_MODE` | 杩愯妯″紡 | `alone` 涓虹嫭绔嬭繍琛岋紝鐣欑┖涓洪泦鎴愭剰鍥?|
| `VITE_MAIN_SHELL_REDIRECT_PREFIX` | 涓诲３缃戝叧鍓嶇紑 | 榛樿 `/main/redirect` |
| `VITE_MAIN_SHELL_ORIGIN` | 涓诲３鏈湴鍦板潃 | 鏈湴鑱旇皟鏃朵娇鐢?|
| `VITE_I18N_TAGS` | 鍥介檯鍖栨枃妗堟爣绛?| 褰撳墠鍊?`G2RAIN_SHARED,INFRA` |

### 杩愯妯″紡璇存槑

- 寮€鍙戦樁娈靛彲璁剧疆 `VITE_RUN_MODE=alone` 鐙珛杩愯锛屾柟渚垮崟鐙皟璇曢〉闈€?- 鑱旇皟闃舵搴旈儴缃插埌娴嬭瘯鐜骞舵帴鍏?`g2rain-main-shell`锛岄€氳繃涓诲３瀹屾垚瀹屾暣璁よ瘉銆佽矾鐢变笌璧勬簮鑱旇皟楠岃瘉銆?- 褰撴湭璁剧疆 `VITE_RUN_MODE=alone` 涓旈〉闈㈠苟闈炵敱 qiankun 鎸傝浇鏃讹紝搴旂敤浼氬厛璺宠浆鍒颁富澹崇綉鍏冲叆鍙ｃ€?
### 瀹夎渚濊禆

```bash
npm install
```

### 鏈湴寮€鍙?
```bash
npm run dev
```

### 鏋勫缓浜х墿

```bash
npm run build
npm run preview
```

### 浠ｇ爜鐢熸垚涓庤祫婧愰厤缃?
```bash
npm run build:generate -- --tables=dict
npm run build:config
```

### 闀滃儚鏋勫缓

```bash
./build.sh
./build.sh --tag latest --build-mode production
```

## 7. 椤圭洰缁撴瀯

鏈珷鍥炵瓟鈥滀唬鐮佷笌妯″潡鏄浣曠粍缁囩殑銆佹帓鏌ュ拰鎵╁睍鏃跺簲璇ュ厛鐪嬪摢閲屸€濄€?
```text
g2rain-infra-app/
鈹溾攢鈹€ src/
鈹?  鈹溾攢鈹€ components
鈹?  鈹溾攢鈹€ platform
鈹?  鈹溾攢鈹€ runtime
鈹?  鈹溾攢鈹€ shared
鈹?  鈹斺攢鈹€ views
鈹溾攢鈹€ lua/
鈹溾攢鈹€ nginx/
鈹溾攢鈹€ Dockerfile
鈹溾攢鈹€ build.sh
鈹溾攢鈹€ vite.config.ts
鈹溾攢鈹€ .env
鈹斺攢鈹€ .env.production
```

### 缁撴瀯璇存槑

- `src/components`锛氶€氱敤缁勪欢銆丠TTP 灏佽銆佹潈闄愮粍浠朵笌绛惧悕鐩稿叧瀹炵幇銆?- `src/platform`锛氬钩鍙扮骇閫傞厤灞傦紝鎵胯浇 qiankun 鐢熷懡鍛ㄦ湡銆佸叏灞€鐘舵€併€佸浗闄呭寲涓庨敊璇鐞嗐€?- `src/runtime`锛氳繍琛屾椂寮曞灞傦紝鎵胯浇 SSO銆佽祫婧愬垵濮嬪寲銆佸姩鎬佽矾鐢变笌鍚姩娴佺▼銆?- `src/shared`锛氶€氱敤宸ュ叿灞傦紝鎵胯浇杩愯妯″紡鍒ゆ柇銆佺敓鎴愬櫒銆佽祫婧愰厤缃壂鎻忓拰鐜鍙橀噺灏佽銆?- `src/views`锛氬熀纭€璁炬柦绫讳笟鍔￠〉闈紝榛樿鎸夆€滀竴涓〃涓€涓洰褰曗€濈殑瑙勮寖缁勭粐銆?- `lua`锛歄penResty Lua 鑴氭湰锛屾壙杞?IAM 鍏挜鑾峰彇銆佸簲鐢ㄧ閽ョ鍚嶇瓑鑳藉姏銆?- `nginx`锛氶粯璁よ繍琛岀幆澧冮厤缃紝浣跨敤 OpenResty 骞跺唴缃?Lua 鏀寔銆?- `build.sh` 涓?`Dockerfile`锛氶粯璁や氦浠樺叆鍙ｃ€?
### src/views 妯″潡璇存槑

- `auth`锛氳璇佷笌鍥炶皟鐩稿叧椤甸潰銆?- `dict`锛氬瓧鍏哥鐞嗛〉闈€?- `dictionary_usage`锛氬瓧鍏镐娇鐢ㄦ儏鍐垫垨鍏宠仈灞曠ず椤甸潰銆?- `g2rain_raindrop`锛氬钩鍙伴洦婊存垨骞冲彴閰嶇疆椤圭浉鍏抽〉闈€?- `i18n_message`锛氬浗闄呭寲鏂囨绠＄悊椤甸潰銆?- `locale_setting`锛氬尯鍩熶笌璇█璁剧疆椤甸潰銆?
### 椤甸潰缁勭粐瑙勮寖

- 榛樿鏍规嵁鏁版嵁搴撹〃鐢熸垚椤甸潰锛屾瘡涓?`table` 瀵瑰簲 `src/views/<table>` 涓€涓洰褰曘€?- 鐩綍鍐呴€氬父鍖呭惈 `index.vue`銆乣api.ts`銆乣type.ts`锛屾寜闇€琛ュ厖 `mock.ts`銆?- 濡傞渶鏂板涓氬姟椤甸潰锛屼篃寤鸿缁х画閬靛惊璇ヨ鑼冿紝浠ヤ究 `build:config` 绋冲畾鎵弿璧勬簮銆?
## 8. 鏍稿績涓氬姟娴佺▼

鏈珷鍥炵瓟鈥滆繖浜涜兘鍔涘湪杩愯鏃舵槸濡備綍涓茶捣鏉ュ伐浣滅殑鈥濄€?
#### 1. 鐙珛杩愯涓庝富澹抽泦鎴愪富绾?
- 寮€鍙戦樁娈佃缃?`VITE_RUN_MODE=alone` 鏃讹紝搴旂敤鐩存帴鐙珛杩愯銆?- 闆嗘垚鎰忓浘涓嬪鏋滃綋鍓嶅苟闈?qiankun 鎸傝浇锛屽簲鐢ㄤ細鍏堣烦杞埌 `g2rain-main-shell` 缃戝叧鍏ュ彛銆?- 鐢?qiankun 姝ｅ紡鎸傝浇鍚庯紝鐢熷懡鍛ㄦ湡閫傞厤灞傛帴绠¤矾鐢卞垵濮嬪寲銆佷富澹虫秷鎭鐞嗗拰瀹炰緥闅旂銆?
#### 2. 璧勬簮鍔犺浇涓庡姩鎬佽矾鐢变富绾?
- 鍚姩鍚庡厛鎵ц杩愯鏃?boot 娴佺▼銆?- 搴旂敤渚濇嵁 `VITE_APPLICATION_CODE` 鎷夊彇骞冲彴璧勬簮銆侀〉闈㈠厓绱犲拰璺敱璧勬簮銆?- `initRoutesFromResources` 鐢熸垚璧勬簮璺敱骞舵敞鍏ュ簲鐢ㄥ疄渚嬨€?- 鏈€缁堣彍鍗曘€佽矾鐢卞拰鏉冮檺璧勬簮淇濇寔骞冲彴鍚屾簮涓€鑷淬€?
#### 3. SSO 涓庣鍚嶈璇佷富绾?
- 杩愯鏃舵娴嬪埌鏈櫥褰曟椂锛屽厛璺宠浆缁熶竴璁よ瘉鍏ュ彛銆?- 鍥炶皟瀹屾垚鍚庨噸鏂板姞杞借祫婧愬苟鎭㈠鐩爣椤甸潰銆?- 娑夊強瀹夊叏绛惧悕鐨勮姹傞€氳繃 `/keys/iam-key-id`銆乣/keys/iam-public-key`銆乣/lua/sign_code` 涓?OpenResty Lua 鍗忓悓瀹屾垚銆?- 杩欐潯涓荤嚎鏋勬垚鍓嶇瀛愬簲鐢ㄥ畬鏁寸殑韬唤涓庡畨鍏ㄨ闂摼璺€?
#### 4. 椤甸潰鐢熸垚涓庤祫婧愬鍏ヤ富绾?
- 寮€鍙戣€呮墽琛?`npm run build:generate -- --tables=<table>` 鐢熸垚椤甸潰楠ㄦ灦銆?- 鐢熸垚鍣ㄨ緭鍑?`src/views/<table>` 涓嬬殑椤甸潰銆佹帴鍙ｃ€佺被鍨嬩笌鍙€?mock銆?- 寮€鍙戝畬鎴愬悗鎵ц `npm run build:config`銆?- 閰嶇疆宸ュ叿鎵弿椤甸潰銆佹帴鍙ｃ€佹寜閽潈闄愬拰璺敱锛岃緭鍑哄彲瀵煎叆骞冲彴鐨勮祫婧愰厤缃枃浠躲€?
#### 5. OpenResty 浜や粯涓荤嚎

- `Dockerfile` 鍏堢敤 Node 闃舵鏋勫缓鍓嶇浜х墿銆?- 杩愯闃舵浣跨敤 OpenResty 鎵胯浇闈欐€佽祫婧愪笌 Lua 鑴氭湰銆?- `nginx/default.conf.template` 鎻愪緵闈欐€佽祫婧愭湇鍔′笌璁よ瘉鐩稿叧浠ｇ悊璺緞銆?- `lua/sign.lua`銆乣lua/sign_api.lua` 瀹屾垚绛惧悕涓庡瘑閽ュ崗浣滆兘鍔涖€?
## 9. 甯哥敤鍛戒护

```bash
npm run dev
npm run build
npm run preview
npm run build:generate -- --tables=dict
npm run build:config
./build.sh
./build.sh --image g2rain/g2rain-infra-app --tag latest --build-mode production
```

## 10. 璐ㄩ噺涓庢祴璇?
- 褰撳墠浠撳簱宸插叿澶囩粺涓€鍓嶇瀛愬簲鐢ㄩ鏋躲€佷富澹抽泦鎴愭ā寮忋€佺鍚嶉摼璺拰璧勬簮椹卞姩璺敱鑳藉姏銆?- 褰撳墠鎵弿鏈彂鐜扮嫭绔嬫祴璇曚綋绯昏鏄庯紝鍚庣画寤鸿浼樺厛琛ラ綈杩愯妯″紡鍒囨崲銆佸浗闄呭寲鏂囨鍔犺浇銆丼SO 鍥炶皟涓庤祫婧愰厤缃壂鎻忕殑鍏抽敭娴嬭瘯銆?- 娑夊強涓诲３鑱旇皟銆佸浗闄呭寲璧勬簮涓庣鍚嶈闂椂锛屽缓璁湪娴嬭瘯鐜瀹屾垚瀹屾暣楠岃瘉銆?
## 11. 鐩稿叧浠撳簱

- `g2rain-infra`锛氬钩鍙板熀纭€璁炬柦鍚庣鏈嶅姟
- `g2rain-main-shell`锛氫富澹充笌缁熶竴鍏ュ彛
- `g2rain-basis`锛氬钩鍙板簲鐢ㄣ€佽祫婧愩€佽鑹蹭笌鏉冮檺搴曞骇
- `g2rain-app-template`锛氬墠绔瓙搴旂敤妯℃澘鏉ユ簮涔嬩竴

## 12. 浣跨敤寤鸿

- 寮€鍙戞湡浼樺厛鐢?`alone` 妯″紡蹇€熻皟璇曢〉闈€?- 鑱旇皟鏈熶紭鍏堟帴鍏ヤ富澹抽獙璇佽璇併€佽祫婧愩€佽矾鐢卞拰鏉冮檺閾捐矾銆?- 瀵逛簬骞冲彴鍩虹閰嶇疆绫绘柊椤甸潰锛屽缓璁户缁伒寰€滄寜琛ㄧ敓鎴愮洰褰曗€濈殑鏂瑰紡锛屽噺灏戠淮鎶ゆ垚鏈€?- 瀵逛簬鍥介檯鍖栧拰瀛楀吀绫婚〉闈紝寤鸿鍚屾鍏虫敞 `VITE_I18N_TAGS` 涓庡钩鍙版枃妗堣祫婧愮殑涓€鑷存€с€?
## 13. 璐＄尞鎸囧崡

娆㈣繋閫氳繃鏂囨。鏀硅繘銆両ssue 鍙嶉銆佹祴璇曡ˉ鍏呫€佷唬鐮佷紭鍖栥€佸姛鑳藉寮虹瓑褰㈠紡鍙備笌璐＄尞銆?
寤鸿娴佺▼锛?1. Fork 鏈粨搴?2. 鍒涘缓鐗规€у垎鏀?3. 鎻愪氦淇敼
4. 鎺ㄩ€佸垎鏀?5. 鎻愪氦 Pull Request

鎻愪氦鍓嶈灏介噺纭繚锛?- 閬靛惊鐜版湁鎶€鏈爤涓庝唬鐮佽鑼?- 琛ュ厖蹇呰娴嬭瘯
- 鏇存柊鐩稿叧鏂囨。
- 纭繚娴嬭瘯閫氳繃

## 14. 璁稿彲璇?
鏈」鐩熀浜?[Apache 2.0璁稿彲璇乚(LICENSE) 寮€婧愩€?
## 15. 鑱旂郴鎴戜滑

- **绔欑偣**: https://www.g2rain.com/
- **Issues**: [GitHub Issues](https://github.com/g2rain/g2rain/issues)
- **璁ㄨ**: [GitHub Discussions](https://github.com/g2rain/g2rain/discussions)
- **閭**: g2rain_developer@163.com

## 16. 鑷磋阿

鎰熻阿鎵€鏈変负杩欎釜椤圭洰鍋氬嚭璐＄尞鐨勫紑鍙戣€呬滑銆?
濡傛灉杩欎釜椤圭洰瀵规偍鏈夊府鍔╋紝娆㈣繋 Star 鏀寔銆