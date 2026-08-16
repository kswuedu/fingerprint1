// ==========================================
// FINGER IQ
// 지문 카메라 촬영 시스템
// ==========================================



// ==========================================
// 접속 비밀번호
// ==========================================

// GitHub Pages 같은 정적 사이트에서는 이 비밀번호가 소스코드에 포함됩니다.
// 강한 보안 기능이 아니라 허용 사용자용 간단한 입장 제한 기능입니다.
const ACCESS_PASSWORD = "finger1004";

const passwordGate =
    document.getElementById("passwordGate");

const accessPasswordInput =
    document.getElementById("accessPassword");

const passwordEnterBtn =
    document.getElementById("passwordEnterBtn");

const passwordError =
    document.getElementById("passwordError");

function unlockApp() {

    const entered =
        accessPasswordInput.value;

    if (entered === ACCESS_PASSWORD) {

        sessionStorage.setItem(
            "fingerIQUnlocked",
            "yes"
        );

        passwordGate.style.display =
            "none";

        passwordError.textContent =
            "";

        return;
    }

    passwordError.textContent =
        "비밀번호가 올바르지 않습니다.";

    accessPasswordInput.focus();
}

if (
    sessionStorage.getItem(
        "fingerIQUnlocked"
    ) === "yes"
) {

    passwordGate.style.display =
        "none";
}

passwordEnterBtn.addEventListener(
    "click",
    unlockApp
);

accessPasswordInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            unlockApp();
        }
    }
);


// 10개 손가락 순서
const fullFingers = [

    {
        hand: "왼손",
        name: "엄지",
        key: "left_thumb"
    },

    {
        hand: "왼손",
        name: "검지",
        key: "left_index"
    },

    {
        hand: "왼손",
        name: "중지",
        key: "left_middle"
    },

    {
        hand: "왼손",
        name: "약지",
        key: "left_ring"
    },

    {
        hand: "왼손",
        name: "새끼",
        key: "left_little"
    },

    {
        hand: "오른손",
        name: "엄지",
        key: "right_thumb"
    },

    {
        hand: "오른손",
        name: "검지",
        key: "right_index"
    },

    {
        hand: "오른손",
        name: "중지",
        key: "right_middle"
    },

    {
        hand: "오른손",
        name: "약지",
        key: "right_ring"
    },

    {
        hand: "오른손",
        name: "새끼",
        key: "right_little"
    }

];


const simpleFingerKeys = [
    "left_thumb","left_index","right_thumb","right_index"
];

let fingers = [...fullFingers];
let testMode = "simple";

// 현재 손가락
let currentIndex = 0;


// 검사자
let participant = {

    name: "",
    birth: "",
    consultant: ""

};


let lastResult = null;

// 지문 데이터
let fingerprintImages = {};

// 동일 손가락 2회 판독 비교
let repeatCaptures = {};
function requiredCapturesPerFinger() {
    return 1;
}


// ==========================================
// HTML 요소
// ==========================================

const startScreen =
    document.getElementById("startScreen");

const fingerScreen =
    document.getElementById("fingerScreen");

const completeScreen =
    document.getElementById("completeScreen");

const resultScreen =
    document.getElementById("resultScreen");

const resultParticipant =
    document.getElementById("resultParticipant");

const top3Results =
    document.getElementById("top3Results");

const intelligenceResults =
    document.getElementById("intelligenceResults");

const learningStyleResult =
    document.getElementById("learningStyleResult");

const fingerPatternResults =
    document.getElementById("fingerPatternResults");

const restartBtn =
    document.getElementById("restartBtn");

const pdfBtn =
    document.getElementById("pdfBtn");


const nameInput =
    document.getElementById("name");

const birthInput =
    document.getElementById("birth");

const consultantInput =
    document.getElementById("consultant");


const startBtn =
    document.getElementById("startBtn");


const currentNumber =
    document.getElementById("currentNumber");

const totalNumber =
    document.getElementById("totalNumber");

const progress =
    document.getElementById("progress");


const handLabel =
    document.getElementById("handLabel");

const fingerName =
    document.getElementById("fingerName");


const cameraBtn =
    document.getElementById("cameraBtn");

const cameraInput =
    document.getElementById("cameraInput");


const galleryBtn =
    document.getElementById("galleryBtn");

const galleryInput =
    document.getElementById("galleryInput");


const previewArea =
    document.getElementById("previewArea");


const photoActions =
    document.getElementById("photoActions");


const retakeBtn =
    document.getElementById("retakeBtn");


const usePhotoBtn =
    document.getElementById("usePhotoBtn");


const nextBtn =
    document.getElementById("nextBtn");


const analysisBtn =
    document.getElementById("analysisBtn");


totalNumber.textContent =
    fingers.length;


// ==========================================
// 화면 전환
// ==========================================

function showScreen(screen) {

    startScreen.classList.remove("active");

    fingerScreen.classList.remove("active");

    completeScreen.classList.remove("active");

    resultScreen.classList.remove("active");

    screen.classList.add("active");

}


// ==========================================
// 검사 시작
// ==========================================


// ==========================================
// v8 검사 데이터 완전 초기화
// ==========================================
function resetAllTestData() {

    currentIndex = 0;
    fingerprintImages = {};

    if (
        typeof repeatCaptures !== "undefined"
    ) {
        repeatCaptures = {};
    }

    if (
        typeof participant === "object" &&
        participant
    ) {
        participant.name = "";
        participant.birth = "";
        participant.consultant = "";
        participant.age = "";
        participant.gender = "";
    }

    lastResult = null;

    [
        "coreSummary",
        "strengthTop3",
        "careerRecommendations",
        "growthPoints",
        "relationshipStrengths",
        "relationshipCautions",
        "workStudyStyle",
        "allAreaAnalysis",
        "oneLinerSummary",
        "strengthEnvironment",
        "strengthShadow",
        "matchingRoles",
        "growthBlocker",
        "growthCoaching",
        "communicationStyle",
        "stressResponse",
        "decisionStyle",
        "fingerprintTypesSummary"
    ].forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {
            element.innerHTML = "";
        }
    });
}

startBtn.addEventListener(
    "click",
    function () {

        resetAllTestData();


        const name =
            nameInput.value.trim();


        if (!name) {

            alert(
                "검사자 이름을 입력해주세요."
            );

            nameInput.focus();

            return;

        }


        participant.name =
            name;

        participant.birth =
            birthInput.value;

        participant.consultant =
            consultantInput.value.trim();


        const selectedMode =
            document.querySelector('input[name="testMode"]:checked');

        testMode = selectedMode ? selectedMode.value : "simple";
        fingers =
            testMode === "simple"
                ? fullFingers.filter(f => simpleFingerKeys.includes(f.key))
                : [...fullFingers];

        currentIndex = 0;
        fingerprintImages = {};
        repeatCaptures = {};

        showScreen(fingerScreen);

        loadFinger();

    }
);


// ==========================================
// 현재 손가락 표시
// ==========================================

function loadFinger() {

    const finger =
        fingers[currentIndex];


    handLabel.textContent =
        finger.hand;


    const repeatCount =
        repeatCaptures[finger.key]
            ? repeatCaptures[finger.key].length
            : 0;

    fingerName.innerHTML =
        `${finger.hand} ${finger.name} 지문
         <div class="repeat-capture-status">
            반복 촬영 ${Math.min(repeatCount + 1, requiredCapturesPerFinger())}
            / ${requiredCapturesPerFinger()}
         </div>`;


    currentNumber.textContent =
        currentIndex + 1;


    const percent =
        ((currentIndex + 1)
        / fingers.length) * 100;


    progress.style.width =
        `${percent}%`;


    previewArea.innerHTML =
        "촬영한 지문이 여기에 표시됩니다.";


    photoActions.style.display =
        "none";


    nextBtn.disabled =
        true;


    cameraInput.value =
        "";

    galleryInput.value =
        "";

}


// ==========================================
// 카메라 실행
// ==========================================

cameraBtn.addEventListener(
    "click",
    function () {

        cameraInput.click();

    }
);


// ==========================================
// 사진 선택
// ==========================================

galleryBtn.addEventListener(
    "click",
    function () {

        galleryInput.click();

    }
);


// ==========================================
// 카메라 사진 처리
// ==========================================

cameraInput.addEventListener(
    "change",
    function (event) {

        handlePhoto(event);

    }
);


// ==========================================
// 갤러리 사진 처리
// ==========================================

galleryInput.addEventListener(
    "change",
    function (event) {

        handlePhoto(event);

    }
);


// ==========================================
// 사진 처리 함수
// ==========================================

function handlePhoto(event) {

    const file =
        event.target.files[0];


    if (!file) {

        return;

    }


    if (!file.type.startsWith("image/")) {

        alert(
            "이미지 파일만 사용할 수 있습니다."
        );

        return;

    }


    const reader =
        new FileReader();

reader.onload =
    function (e) {

        previewArea.innerHTML = "";

        const img =
            document.createElement("img");

        img.src =
            e.target.result;

        previewArea.appendChild(img);


        // 이미지가 실제로 로드된 후 품질 검사
        img.onload = function () {

            const quality =
                ImageQuality.analyze(
                    file,
                    img
                );
         const currentFinger =
    fingers[currentIndex];

         const fingerprint =
    FingerprintDetector.analyze(
        img,
        currentFinger ? currentFinger.key : undefined
    );
            // 품질 결과 표시
            const qualityBox =
                document.createElement("div");

            qualityBox.className =
                "quality-result";


            let icon = "⚠️";

            if (quality.level === "good") {

                icon = "✅";

            } else if (
                quality.level === "bad"
            ) {

                icon = "❌";

            }


            qualityBox.innerHTML = `

                <div class="quality-icon">
                    ${icon}
                </div>

                <div class="quality-title">
                    사진 품질 점수
                    ${quality.score}점
                </div>

                <div class="quality-message">
                    ${quality.message}
                </div>

                <div class="quality-details">

                    선명도 ${quality.sharpness} ·
                    밝기 ${quality.brightness} ·
                    대비 ${quality.contrast}

                </div>

            `;


            previewArea.appendChild(
                qualityBox
            );
const fingerprintBox =
    document.createElement("div");

fingerprintBox.className =
    "fingerprint-result";

fingerprintBox.innerHTML = `

    <div class="fingerprint-title">
        🔍 지문 패턴 자동 추정
    </div>

    <div class="fingerprint-pattern">
        ${fingerprint.label}
    </div>

    <div class="fingerprint-confidence">
        추정 신뢰도 ${fingerprint.confidence}%
    </div>

    <div class="fingerprint-reason">
        ${fingerprint.reason}
    </div>

    ${
        fingerprint.pattern === "UNKNOWN" &&
        fingerprint.tooSmall !== true &&
        fingerprint.focusIssue !== true
            ? `
                <div class="fingerprint-warning">
                    재촬영 없이 진행할 수도 있습니다.
                    이 경우 가장 가까운 유형으로 낮은 신뢰도로 임시 분류합니다.
                </div>
              `
            : ""
    }

    ${
        fingerprint.debug
            ? `
                <div class="fingerprint-debug">
                    융선점수 ${fingerprint.debug.ridgeScore ?? "-"} ·
                    방향일관성 ${fingerprint.debug.coherence ?? "-"} ·
                    중심변화 ${fingerprint.debug.centerVariation ?? "-"} ·
                    곡률 ${fingerprint.debug.curvature ?? "-"} ·
                    유효융선 ${fingerprint.debug.usableRidgeRatio ?? "-"} ·
                    ROI ${fingerprint.debug.roiScale ?? "-"} ·
                    방향편향 ${fingerprint.debug.lateralBias ?? "-"} ·
                    코어군집 ${fingerprint.debug.coreClusters ?? "-"}
                    ${
                        fingerprint.debug.scores
                            ? `<br>후보비율
                               평아치 ${fingerprint.debug.probabilities?.ARCH ?? "-"}% /
                               텐트아치 ${fingerprint.debug.probabilities?.TENTED_ARCH ?? "-"}% /
                               척골루프 ${fingerprint.debug.probabilities?.LOOP ?? "-"}% /
                               요골루프 ${fingerprint.debug.probabilities?.RADIAL_LOOP ?? "-"}% /
                               소용돌이 ${fingerprint.debug.probabilities?.WHORL ?? "-"}% /
                               이중루프 ${fingerprint.debug.probabilities?.DOUBLE_LOOP ?? "-"}%`
                            : ""
                    }
                </div>
              `
            : ""
    }

`;

previewArea.appendChild(
    fingerprintBox
);

            // 데이터 저장
            const finger =
                fingers[currentIndex];


            fingerprintImages[
    finger.key
] = {

    file: file,

    dataUrl:
        e.target.result,

    confirmed: false,

    quality:
        quality,

    detection:
        fingerprint

};

            if (!repeatCaptures[finger.key]) {
                repeatCaptures[finger.key] = [];
            }

            repeatCaptures[finger.key].push({
                dataUrl: e.target.result,
                quality,
                detection: fingerprint
            });

            if (repeatCaptures[finger.key].length > requiredCapturesPerFinger()) {
                repeatCaptures[finger.key] =
                    repeatCaptures[finger.key].slice(-requiredCapturesPerFinger());
            }

            photoActions.style.display =
                "flex";


            // 품질이 너무 낮으면
            // 사용 버튼 비활성화
            if (
                quality.level === "bad" ||
                fingerprint.tooSmall === true ||
                fingerprint.focusIssue === true
            ) {

                usePhotoBtn.disabled =
                    true;

                usePhotoBtn.style.opacity =
                    "0.5";

            } else {

                usePhotoBtn.disabled =
                    false;

                usePhotoBtn.style.opacity =
                    "1";

            }


            nextBtn.disabled =
                true;

        };

    };
    

    reader.readAsDataURL(file);

}


// ==========================================
// 다시 촬영
// ==========================================

retakeBtn.addEventListener(
    "click",
    function () {

        const finger =
            fingers[currentIndex];


        delete fingerprintImages[
            finger.key
        ];

        // 사용자가 "다시 촬영"을 누른 경우 방금 촬영값만 제거
        if (repeatCaptures[finger.key]?.length) {
            repeatCaptures[finger.key].pop();
        }


        previewArea.innerHTML =
            "촬영한 지문이 여기에 표시됩니다.";


        photoActions.style.display =
            "none";


        nextBtn.disabled =
            true;


        cameraInput.value =
            "";


        galleryInput.value =
            "";


        // 바로 카메라 실행
        cameraInput.click();

    }
);


// ==========================================
// 사진 사용
// ==========================================

usePhotoBtn.addEventListener(
    "click",
    function () {

        const finger =
            fingers[currentIndex];

        const samples = repeatCaptures[finger.key] || [];

        if (samples.length < requiredCapturesPerFinger()) {
            alert(
                `${finger.hand} ${finger.name}을 한 번 더 촬영해주세요.\n간편검사는 각 손가락을 1회 촬영합니다.`
            );

            // 첫 촬영은 보관하고 화면만 다음 촬영 상태로 초기화
            previewArea.innerHTML = "두 번째 촬영을 진행해주세요.";
            photoActions.style.display = "none";
            nextBtn.disabled = true;
            cameraInput.value = "";
            galleryInput.value = "";
            loadFinger();
            return;
        }

        const resolved = samples.map(sample => {
            const d = sample.detection || {};
            return d.effectivePattern ||
                   (d.pattern && d.pattern !== "UNKNOWN" ? d.pattern : null) ||
                   d.fallbackCandidate ||
                   null;
        });

        const agreement =
            resolved.length >= 1 &&
            !!resolved[0];

        if (!agreement) {
            repeatCaptures[finger.key] = [];
            delete fingerprintImages[finger.key];

            alert(
                `${finger.hand} ${finger.name}의 두 번 판독 결과가 서로 다릅니다.\n같은 손가락을 다시 2회 촬영해주세요.`
            );

            previewArea.innerHTML = "촬영한 지문이 여기에 표시됩니다.";
            photoActions.style.display = "none";
            nextBtn.disabled = true;
            cameraInput.value = "";
            galleryInput.value = "";
            loadFinger();
            return;
        }

        fingerprintImages[finger.key].detection.effectivePattern = resolved[0];
        fingerprintImages[finger.key].detection.usedConsensus = true;
        fingerprintImages[finger.key].detection.agreementLabel =
            "1회 판독";


        if (!fingerprintImages[
            finger.key
        ]) {

            return;

        }


        const storedImage =
            fingerprintImages[
                finger.key
            ];

        storedImage.confirmed = true;

        if (
            storedImage.detection &&
            storedImage.detection.pattern === "UNKNOWN"
        ) {

            storedImage.detection.effectivePattern =
                storedImage.detection.fallbackCandidate ||
                (
                    storedImage.detection.debug &&
                    storedImage.detection.debug.scores
                        ? Object.entries(
                            storedImage.detection.debug.scores
                          ).sort(
                            (a, b) => b[1] - a[1]
                          )[0][0]
                        : "LOOP"
                );

            storedImage.detection.usedFallback =
                true;
        }


        photoActions.style.display =
            "none";


        nextBtn.disabled =
            false;


        previewArea.style.border =
            "1px solid #aaa";

    }
);


// ==========================================
// 다음 손가락
// ==========================================

nextBtn.addEventListener(
    "click",
    function () {

        const finger =
            fingers[currentIndex];


        const image =
            fingerprintImages[
                finger.key
            ];


        if (!image || !image.confirmed) {

            alert(
                "사진을 확인한 후 '이 사진 사용'을 눌러주세요."
            );

            return;

        }


        // 마지막 손가락
        if (
            currentIndex ===
            fingers.length - 1
        ) {

            showScreen(
                completeScreen
            );

            return;

        }


        currentIndex++;

        loadFinger();

    }
);


// ==========================================
// 분석 시작
// ==========================================

analysisBtn.addEventListener(
    "click",
    function () {

        const fingerprintData = {};

        for (const finger of fingers) {

            const imageData =
                fingerprintImages[finger.key];

            if (
                !imageData ||
                !imageData.confirmed ||
                !imageData.detection
            ) {

                alert(
                    "모든 지문이 정상적으로 등록되었는지 확인해주세요."
                );

                return;
            }

            const pattern =
                imageData.detection.effectivePattern ||
                imageData.detection.pattern;

            if (!pattern) {

                alert(
                    `${finger.hand} ${finger.name} 지문 데이터가 없습니다.`
                );

                return;
            }

            const detection =
                imageData.detection || {};

            fingerprintData[finger.key] = {
                pattern,
                effectivePattern:
                    detection.effectivePattern,
                fallbackCandidate:
                    detection.fallbackCandidate,
                confidence:
                    detection.confidence,
                probabilities:
                    detection.debug?.probabilities ||
                    detection.probabilities ||
                    null,
                ridgeScore:
                    detection.debug?.ridgeScore ??
                    detection.ridgeScore,
                coherence:
                    detection.debug?.coherence ??
                    detection.coherence,
                centerVariation:
                    detection.debug?.centerVariation,
                curvature:
                    detection.debug?.curvature
            };
        }

        let result;

        try {
            result =
                FingerprintEngine.analyze(
                    fingerprintData
                );

            lastResult = result;
        } catch (error) {
            console.error(
                "FINGER IQ 분석 엔진 오류:",
                error
            );
            alert(
                "지문 분석 중 오류가 발생했습니다. 다시 시도해주세요."
            );
            return;
        }

        // 결과 화면 전환은 상세 리포트 렌더링과 완전히 분리합니다.
        showScreen(
            resultScreen
        );

        window.scrollTo(
            0,
            0
        );

        try {
            renderResult(
                result,
                fingerprintData
            );
        } catch (error) {
            console.error(
                "FINGER IQ 결과 화면 렌더링 오류:",
                error
            );

            // 화면은 이미 이동했으므로 최소 결과라도 보이게 합니다.
            if (resultParticipant) {
                resultParticipant.textContent =
                    participant.name
                        ? `${participant.name}님의 분석이 완료되었습니다.`
                        : "지문 분석이 완료되었습니다.";
            }

            const coreSummary =
                document.getElementById(
                    "coreSummary"
                );

            if (
                coreSummary &&
                result &&
                result.ranking
            ) {
                coreSummary.innerHTML =
                    `<strong>분석 완료</strong>
                     <p>${result.ranking
                        .slice(0, 3)
                        .map(item => `${item.name} ${item.score}점`)
                        .join(" · ")}</p>`;
            }
        }
    }
);




// ==========================================
// v7 성향별 컬러 / 상세 인간관계 가이드
// ==========================================
const REPORT_THEME = {
    linguistic: "theme-violet",
    logical: "theme-blue",
    spatial: "theme-indigo",
    bodily: "theme-red",
    musical: "theme-rose",
    interpersonal: "theme-orange",
    intrapersonal: "theme-teal",
    naturalistic: "theme-green"
};

const RELATIONSHIP_DETAIL = {
    linguistic: {
        conflict: "갈등이 생기면 설명을 많이 하거나 자신의 의도를 논리적으로 풀어내려는 경향이 나타날 수 있습니다.",
        otherNeeds: "상대는 설명보다 먼저 공감이나 짧은 반응을 원할 수 있습니다.",
        practice: "① 상대 말을 끝까지 듣기 ② 핵심 감정 한 문장으로 확인하기 ③ 해결책은 상대가 원할 때 제안하기",
        phrase: "“내가 이해한 게 맞는지 먼저 확인해볼게.”"
    },
    logical: {
        conflict: "갈등 상황에서도 사실·원인·해결책을 먼저 찾으려 할 수 있어 상대에게 냉정하게 느껴질 수 있습니다.",
        otherNeeds: "상대는 문제 해결보다 자신의 감정이 인정받았다는 느낌을 먼저 원할 수 있습니다.",
        practice: "① 옳고 그름 판단을 잠시 미루기 ② 감정을 먼저 확인하기 ③ 해결책은 선택지 형태로 제안하기",
        phrase: "“해결책보다 지금 네 마음부터 들어볼게.”"
    },
    spatial: {
        conflict: "머릿속에서 전체 그림을 빠르게 그리기 때문에 상대가 세부 설명을 따라오지 못하면 답답함을 느낄 수 있습니다.",
        otherNeeds: "상대에게는 중간 과정과 구체적 예시가 더 필요할 수 있습니다.",
        practice: "① 결론만 말하지 않기 ② 예시를 하나 들기 ③ 상대가 이해한 내용을 다시 말해보게 하기",
        phrase: "“내가 생각한 그림을 단계별로 설명해볼게.”"
    },
    bodily: {
        conflict: "대화보다 행동으로 빨리 해결하려는 경향이 있어 상대가 충분히 이야기하지 못했다고 느낄 수 있습니다.",
        otherNeeds: "상대는 행동 전에 충분한 설명과 동의를 원할 수 있습니다.",
        practice: "① 바로 행동하기 전 10초 멈추기 ② 상대 의사 확인하기 ③ 속도를 맞추기",
        phrase: "“바로 움직이기 전에 네 생각부터 들을게.”"
    },
    musical: {
        conflict: "상대의 말투나 분위기 변화에 민감하게 반응하여 실제 의도보다 크게 받아들일 수 있습니다.",
        otherNeeds: "상대는 단순히 피곤하거나 집중이 흐트러진 것일 수도 있습니다.",
        practice: "① 분위기와 사실을 구분하기 ② 추측 대신 질문하기 ③ 혼자 의미를 확대하지 않기",
        phrase: "“내가 이렇게 느꼈는데, 네 의도는 어땠는지 궁금해.”"
    },
    interpersonal: {
        conflict: "관계를 깨뜨리고 싶지 않아 자신의 불편함을 참다가 한꺼번에 지치거나 서운해질 수 있습니다.",
        otherNeeds: "상대는 명확한 기준을 알려줘야 오히려 관계를 편하게 유지할 수 있습니다.",
        practice: "① 작은 불편함부터 말하기 ② 거절을 관계 단절로 생각하지 않기 ③ 책임 범위를 구분하기",
        phrase: "“도와주고 싶지만 여기까지는 내가 하기 어려워.”"
    },
    intrapersonal: {
        conflict: "감정이나 생각을 혼자 충분히 정리한 뒤 말하려 하여 상대에게는 갑자기 거리를 두는 것처럼 보일 수 있습니다.",
        otherNeeds: "상대는 이유를 모르는 침묵보다 짧은 설명을 원할 수 있습니다.",
        practice: "① 혼자 있을 시간이 필요하다고 알리기 ② 정리가 끝날 시간을 약속하기 ③ 완벽한 문장보다 현재 감정을 짧게 말하기",
        phrase: "“조금 정리할 시간이 필요해. 오늘 안에 다시 이야기할게.”"
    },
    naturalistic: {
        conflict: "세부적인 차이와 오류를 빨리 발견해 상대의 큰 의도보다 수정할 부분을 먼저 말할 수 있습니다.",
        otherNeeds: "상대는 자신의 노력이나 전체 방향이 인정받기를 원할 수 있습니다.",
        practice: "① 잘된 점을 먼저 말하기 ② 수정 포인트는 1~2개로 제한하기 ③ 전체 목적과 연결해서 제안하기",
        phrase: "“전체 방향은 좋아. 한두 가지만 같이 다듬어보자.”"
    }
};

// ==========================================
// v6 상세 결과 콘텐츠
// ==========================================
const REPORT_INFO = {
    linguistic:{strength:"말과 글로 생각을 정리하고 핵심을 전달하는 활동에서 강점을 활용하기 좋습니다.",careers:["교육·강의","콘텐츠 기획","글쓰기·편집","홍보·마케팅"],growth:"이미지·숫자·체험 등 비언어적 방식으로도 정보를 정리해보세요.",relS:"의견을 언어로 정리하고 상대의 이야기를 핵심 중심으로 연결하는 데 강점을 활용할 수 있습니다.",relC:"설명이 길어지면 상대가 핵심을 놓칠 수 있으니 결론을 먼저 말하고 이해 여부를 확인해보세요.",work:"읽고 쓰고 설명하면서 내용을 자신의 언어로 재구성하는 방식이 잘 맞을 수 있습니다."},
    logical:{strength:"원인과 결과, 규칙과 순서를 찾아 복잡한 문제를 구조화하는 활동에서 강점을 활용하기 좋습니다.",careers:["기획·전략","데이터 분석","연구","개발·IT","재무·품질관리"],growth:"효율과 정답뿐 아니라 사람의 감정과 상황적 맥락도 함께 고려해보세요.",relS:"복잡한 상황을 차분히 정리하고 해결책을 제안하는 역할에 강점을 활용할 수 있습니다.",relC:"상대가 공감을 원하는 순간에는 해결책보다 감정을 먼저 확인하는 것이 도움이 됩니다.",work:"목표를 단계로 나누고 체크리스트·숫자·기준을 활용하는 방식이 잘 맞을 수 있습니다."},
    spatial:{strength:"그림, 위치, 형태, 배치처럼 시각적 구조를 파악하고 구성하는 활동에서 강점을 활용하기 좋습니다.",careers:["디자인","건축·공간기획","영상·사진","제품기획","시각 콘텐츠"],growth:"머릿속 이미지를 문장·일정·실행 단계로 구체화하는 연습을 더해보세요.",relS:"상황의 전체 그림을 파악하고 새로운 관점을 제시하는 역할에 강점을 활용할 수 있습니다.",relC:"내가 머릿속으로 이해한 그림을 상대도 알고 있다고 가정하지 말고 구체적으로 설명해보세요.",work:"도표·이미지·마인드맵처럼 전체 구조를 눈으로 볼 수 있는 자료를 활용해보세요."},
    bodily:{strength:"직접 움직이고 체험하며 익히거나 현장에서 실행하는 활동에서 강점을 활용하기 좋습니다.",careers:["스포츠·코칭","공연·무대","현장 운영","체험교육","기술·제작"],growth:"바로 행동하기 전에 목표와 순서를 짧게 정리하면 실행력을 더 안정적으로 활용할 수 있습니다.",relS:"말보다 행동으로 돕고 함께 움직이며 분위기에 활력을 더하는 역할에 강점을 활용할 수 있습니다.",relC:"빠른 행동 속도가 상대에게 재촉처럼 느껴지지 않도록 상대의 속도도 확인해보세요.",work:"직접 해보고 반복하며 익히는 실습·체험 중심 방식이 잘 맞을 수 있습니다."},
    musical:{strength:"리듬, 소리, 반복되는 패턴과 감각적인 흐름을 활용하는 활동에서 강점을 활용하기 좋습니다.",careers:["음악·공연","음향","영상·미디어","예술교육","콘텐츠 제작"],growth:"감각적인 아이디어를 기록하고 일정과 목표로 구체화해보세요.",relS:"분위기와 말투의 변화를 섬세하게 느끼고 조화를 만드는 역할에 강점을 활용할 수 있습니다.",relC:"분위기를 민감하게 받아들일 때 상대의 의도를 혼자 단정하기보다 직접 확인해보세요.",work:"리듬·반복·소리 또는 일정한 패턴을 활용하는 학습 환경이 도움이 될 수 있습니다."},
    interpersonal:{strength:"사람과 협력하고 의견을 주고받으며 관계 속에서 목표를 만들어가는 활동에 관심을 두어볼 수 있습니다.",careers:["상담·코칭","교육","HR·조직관리","영업·서비스","행사·커뮤니티 운영"],growth:"다른 사람의 기대뿐 아니라 자신의 시간과 기준도 함께 챙겨보세요.",relS:"사람의 반응을 살피고 연결하며 협력 분위기를 만드는 역할에 강점을 활용할 수 있습니다.",relC:"관계를 위해 지나치게 맞추기보다 필요한 경우 자신의 생각과 경계를 분명하게 표현해보세요.",work:"토론·질문·피드백·팀 활동을 통해 생각을 발전시키는 방식이 잘 맞을 수 있습니다."},
    intrapersonal:{strength:"자신의 생각과 목표를 돌아보고 스스로 방향을 정하는 활동에서 강점을 활용하기 좋습니다.",careers:["기획","연구","창작","코칭","독립 프로젝트"],growth:"충분히 생각한 뒤에만 시작하기보다 작은 행동부터 시험해보세요.",relS:"자신의 감정과 생각을 정리하고 관계를 돌아보는 능력을 관계 개선에 활용할 수 있습니다.",relC:"혼자 정리할 시간이 필요할 때 침묵만 하기보다 필요한 시간을 상대에게 알려주세요.",work:"혼자 집중할 시간, 개인 목표, 자기평가를 활용하는 방식이 잘 맞을 수 있습니다."},
    naturalistic:{strength:"세부 특징을 관찰하고 분류하며 환경 속 차이와 반복 패턴을 발견하는 활동에 관심을 두어볼 수 있습니다.",careers:["환경·생명","연구·조사","식품·농업","반려동물 분야","현장 분석"],growth:"세부 차이에 집중하면서 전체 목적과 우선순위도 함께 확인해보세요.",relS:"작은 변화와 세부사항을 알아차리고 꼼꼼하게 챙기는 역할에 강점을 활용할 수 있습니다.",relC:"세부 오류가 먼저 보이더라도 상대가 말하려는 큰 의도를 먼저 확인해보세요.",work:"실제 사례를 관찰하고 비교·분류하며 기록하는 방식이 잘 맞을 수 있습니다."}
};


// ==========================================
// v9 확장 리포트 콘텐츠 (성향 심화 섹션)
// ==========================================
const ROLE_LABELS = {
    linguistic: { primary: "교육자", secondary: "기획자" },
    logical: { primary: "분석가", secondary: "기획자" },
    spatial: { primary: "창작자", secondary: "기획자" },
    bodily: { primary: "실행자", secondary: "리더" },
    musical: { primary: "창작자", secondary: "지원자" },
    interpersonal: { primary: "조정자", secondary: "리더" },
    intrapersonal: { primary: "기획자", secondary: "분석가" },
    naturalistic: { primary: "분석가", secondary: "지원자" }
};

const PERSONA_INFO = {
    linguistic: {
        oneLiner: "생각을 말과 글로 정리해 사람들에게 명확하게 전달하는 표현형",
        keywords: ["표현력", "설득력", "정리력", "공감소통", "전달력"],
        environment: "생각을 설명하거나 글로 남겨야 하는 상황, 여러 사람 앞에서 발표하거나 자료를 정리하는 역할을 맡았을 때 강점이 잘 드러납니다.",
        perception: "주변에서는 \"말이 잘 통한다\", \"설명을 들으면 이해가 쉬워진다\"는 평가를 받기 쉽습니다.",
        shadow: [
            { trait: "설명력", downside: "지나치면 말이 길어지고 상대가 핵심을 놓칠 수 있음" },
            { trait: "논리적 표현", downside: "지나치면 상대의 감정보다 말의 정확성을 먼저 따지게 됨" }
        ],
        blocker: {
            tendency: "완벽한 문장으로 정리되기 전까지 말이나 글을 시작하지 못하는 경향",
            neglect: "생각만 다듬다가 정작 표현할 기회를 놓치는 일이 반복될 수 있어요.",
            grow: "초안을 먼저 꺼내고 다듬는 순서로 바꾸면 표현력이 실행력으로 이어집니다."
        },
        coaching: [
            "이번 주 안에 생각 하나를 완성된 글이 아니어도 좋으니 짧게 적어 공유해보기",
            "설명할 때 결론부터 한 문장으로 먼저 말해보기",
            "말하기 전 걸리는 시간에 제한을 두고 일단 시작해보기"
        ],
        stress: {
            pressure: "평소보다 말이 많아지거나 반대로 설명을 계속 다듬느라 정작 결정이 늦어질 수 있습니다.",
            failure: "무엇이 잘못됐는지 스스로에게 계속 설명하며 되짚는 경향이 나타날 수 있습니다.",
            conflict: "논리적으로 상황을 정리하려다 상대에게는 따지는 것처럼 느껴질 수 있습니다.",
            unrecognized: "내 의도가 제대로 전달되지 않았다고 느끼며 같은 말을 다르게 반복 설명하려 할 수 있습니다.",
            recovery: "회복 팁: 말이나 글로 정리하기 전에 감정을 먼저 알아차리는 시간을 잠깐 가져보세요."
        },
        communication: {
            speak: "생각을 논리적인 순서로 풀어 설명하는 편입니다.",
            energized: "내 이야기를 끝까지 들어주고 핵심을 이해했다는 반응을 받을 때 힘을 얻습니다.",
            drained: "설명을 끊기거나 결론만 요구받을 때 스트레스를 받을 수 있습니다.",
            conflictCaution: "갈등 상황에서는 설명이 길어지지 않도록 핵심만 먼저 말해보세요.",
            goodToKnow: "이 사람과 대화할 때는 결론을 재촉하기보다 설명을 한 번은 끝까지 들어주는 것이 도움이 됩니다."
        }
    },
    logical: {
        oneLiner: "차분하게 분석하고, 근거가 쌓이면 깊게 파고드는 전략형",
        keywords: ["분석적", "신중함", "논리적", "집중력", "완성도"],
        environment: "문제의 원인을 찾아야 하거나, 절차와 기준을 세워야 하는 업무, 복잡한 상황을 구조화해야 할 때 강점이 잘 드러납니다.",
        perception: "주변에서는 \"믿고 맡길 수 있다\", \"흔들리지 않고 정리해준다\"는 평가를 받기 쉽습니다.",
        shadow: [
            { trait: "신중함", downside: "지나치면 결정이 계속 미뤄질 수 있음" },
            { trait: "완성도 추구", downside: "지나치면 시작 자체가 늦어질 수 있음" }
        ],
        blocker: {
            tendency: "충분한 근거와 확신이 생길 때까지 행동을 미루는 경향",
            neglect: "완벽하게 준비된 순간은 잘 오지 않아, 시작 자체가 계속 뒤로 밀릴 수 있어요.",
            grow: "'80% 확신'에서 일단 작게 시작하는 기준을 세우면 분석력이 실행력으로 연결됩니다."
        },
        coaching: [
            "이번 주 새로운 일 하나를 확신이 100%가 아니어도 시작해보기",
            "결정할 때 스스로 생각할 시간에 제한을 두기(예: 10분)",
            "완벽한 계획보다 우선 실행 가능한 60%짜리 안을 먼저 꺼내보기"
        ],
        stress: {
            pressure: "결정을 더 미루거나 근거를 더 모으려는 경향이 강해질 수 있습니다.",
            failure: "무엇이 잘못됐는지 원인을 반복해서 되짚으며 자책이 길어질 수 있습니다.",
            conflict: "감정보다 사실과 논리로 상황을 정리하려다 상대에게 차갑게 느껴질 수 있습니다.",
            unrecognized: "결과보다 과정의 논리성을 다시 설명하려 하며 답답함을 느낄 수 있습니다.",
            recovery: "회복 팁: 지금 필요한 게 '더 많은 정보'인지 '작은 실행'인지 스스로에게 먼저 물어보세요."
        },
        communication: {
            speak: "근거와 순서를 갖춰 차분하게 설명하는 편입니다.",
            energized: "논리가 통했다는 확인, 구체적인 피드백을 받을 때 힘을 얻습니다.",
            drained: "근거 없이 감정적으로 재촉받거나 즉흥적인 결정을 강요받을 때 스트레스를 받습니다.",
            conflictCaution: "갈등 상황에서는 옳고 그름을 따지기 전에 상대 감정을 먼저 확인해보세요.",
            goodToKnow: "이 사람과 대화할 때는 결론을 재촉하기보다 생각을 정리할 시간을 주는 것이 도움이 됩니다."
        }
    },
    spatial: {
        oneLiner: "머릿속에 전체 그림을 그리고, 구조와 배치로 아이디어를 완성하는 구상형",
        keywords: ["직관적", "구조화", "심미성", "아이디어", "확장적사고"],
        environment: "전체 구조를 설계하거나 이미지·공간·형태를 다루는 일, 새로운 아이디어를 시각적으로 구체화해야 할 때 강점이 잘 드러납니다.",
        perception: "주변에서는 \"보는 눈이 다르다\", \"큰 그림을 잘 그린다\"는 평가를 받기 쉽습니다.",
        shadow: [
            { trait: "직관적 통찰", downside: "지나치면 설명 없이 결론만 제시해 상대가 따라오지 못할 수 있음" },
            { trait: "확장적 사고", downside: "지나치면 아이디어만 늘고 마무리가 늦어질 수 있음" }
        ],
        blocker: {
            tendency: "머릿속 그림이 완벽하게 그려지기 전까지는 실행을 미루는 경향",
            neglect: "아이디어만 계속 확장되고 실제로 손을 대는 시점이 계속 뒤로 밀릴 수 있어요.",
            grow: "전체 그림의 일부만 먼저 스케치해보는 습관을 들이면 구상력이 결과물로 이어집니다."
        },
        coaching: [
            "이번 주 머릿속 아이디어 하나를 러프 스케치나 메모로만이라도 꺼내보기",
            "결정 시간에 제한을 두고 완벽한 그림이 아니어도 진행하기",
            "완성된 그림을 보여주기 전, 중간 과정을 한 번 공유해보기"
        ],
        stress: {
            pressure: "머릿속으로 여러 가능성을 동시에 그리다 오히려 정리가 안 되는 느낌을 받을 수 있습니다.",
            failure: "무엇이 잘못됐는지 전체 그림을 다시 그려보려 하며 시간이 오래 걸릴 수 있습니다.",
            conflict: "본인은 전체 맥락에서 말했다고 생각하지만 상대는 비약처럼 느낄 수 있습니다.",
            unrecognized: "설명이 부족했나 자책하기보다 상대가 이해 못 했다고 느끼며 답답해할 수 있습니다.",
            recovery: "회복 팁: 머릿속 그림을 한 문장이나 그림 한 장으로 단순화해서 먼저 꺼내보세요."
        },
        communication: {
            speak: "결론이나 전체 그림을 먼저 던지고 세부는 나중에 채우는 편입니다.",
            energized: "내 아이디어에 관심을 보이고 함께 발전시켜줄 때 힘을 얻습니다.",
            drained: "세부 절차만 반복해서 확인받거나 아이디어를 바로 평가받을 때 스트레스를 받습니다.",
            conflictCaution: "갈등 상황에서는 결론만 말하지 말고 중간 과정을 한 번 더 설명해보세요.",
            goodToKnow: "이 사람과 대화할 때는 큰 그림을 먼저 물어보고 세부는 천천히 채워가는 것이 도움이 됩니다."
        }
    },
    bodily: {
        oneLiner: "생각보다 몸이 먼저 움직이고, 직접 해보면서 익히는 실행형",
        keywords: ["추진력", "실행력", "적응력", "현장감각", "체험학습"],
        environment: "직접 몸을 움직이거나 현장에서 즉각 대응해야 하는 일, 결과를 눈으로 바로 확인할 수 있는 업무에서 강점이 잘 드러납니다.",
        perception: "주변에서는 \"일단 해보고 판단이 빠르다\", \"현장에서 믿음직하다\"는 평가를 받기 쉽습니다.",
        shadow: [
            { trait: "추진력", downside: "지나치면 독단적으로 밀어붙이는 것처럼 보일 수 있음" },
            { trait: "즉각적 실행", downside: "지나치면 충분한 상의 없이 먼저 움직여 갈등이 생길 수 있음" }
        ],
        blocker: {
            tendency: "흥미가 떨어지면 마무리가 약해지고 새로운 자극을 찾아 넘어가려는 경향",
            neglect: "시작한 일들이 완성되지 못한 채 쌓여 스스로도 성취감을 느끼기 어려워질 수 있어요.",
            grow: "마무리 지점을 미리 정해두고 짧게라도 끝맺는 습관을 들이면 추진력이 성과로 이어집니다."
        },
        coaching: [
            "이번 주 새로운 일 하나는 시작만 하지 말고 작게라도 끝까지 마무리해보기",
            "바로 움직이기 전 10초만 멈추고 상대 의견을 물어보기",
            "하루 한 번, 시작한 일 중 하나를 완료 표시해보기"
        ],
        stress: {
            pressure: "생각보다 몸이 먼저 움직여 성급한 행동으로 이어질 수 있습니다.",
            failure: "가만히 있기보다 곧바로 다른 행동으로 넘어가며 원인 분석을 건너뛸 수 있습니다.",
            conflict: "대화보다 행동으로 먼저 해결하려다 상대가 미처 이야기를 못 했다고 느낄 수 있습니다.",
            unrecognized: "인정받지 못한다고 느끼면 더 많은 행동으로 증명하려는 경향이 나타날 수 있습니다.",
            recovery: "회복 팁: 움직이기 전에 잠깐 멈춰서 지금 필요한 게 행동인지 대화인지 구분해보세요."
        },
        communication: {
            speak: "말보다 행동으로 먼저 보여주는 편입니다.",
            energized: "말보다 실제로 함께 해보자는 제안을 받을 때 힘을 얻습니다.",
            drained: "긴 설명이나 이론적인 논의가 계속될 때 답답함을 느낄 수 있습니다.",
            conflictCaution: "갈등 상황에서는 바로 행동하기보다 상대의 말을 먼저 들어보세요.",
            goodToKnow: "이 사람과 대화할 때는 말로만 설명하기보다 직접 보여주거나 함께 해보는 방식이 더 잘 통합니다."
        }
    },
    musical: {
        oneLiner: "분위기와 흐름을 섬세하게 느끼고, 감각적으로 표현하는 감성형",
        keywords: ["감수성", "리듬감", "섬세함", "표현력", "몰입감"],
        environment: "분위기와 감각적 흐름을 다루는 일, 반복되는 패턴이나 리듬 속에서 몰입할 수 있는 환경에서 강점이 잘 드러납니다.",
        perception: "주변에서는 \"분위기를 잘 읽는다\", \"섬세하게 느낀다\"는 평가를 받기 쉽습니다.",
        shadow: [
            { trait: "섬세한 감수성", downside: "지나치면 사소한 분위기 변화에도 쉽게 영향을 받을 수 있음" },
            { trait: "감각적 몰입", downside: "지나치면 감정에 휩쓸려 객관적 판단이 흐려질 수 있음" }
        ],
        blocker: {
            tendency: "타인의 반응이나 분위기에 지나치게 신경 쓰다 자기 페이스를 잃는 경향",
            neglect: "주변 분위기에 계속 맞추다 정작 자신이 원하는 방향을 놓칠 수 있어요.",
            grow: "분위기와 사실을 구분해서 보는 연습을 하면 섬세함이 강점으로 안정적으로 작동합니다."
        },
        coaching: [
            "이번 주 분위기에 맞추기보다 내 생각을 먼저 말해보는 순간 하나 만들기",
            "느낀 감정을 추측하지 말고 직접 질문으로 확인해보기",
            "하루 한 번, 내가 느낀 것과 사실을 구분해서 적어보기"
        ],
        stress: {
            pressure: "주변 반응에 더 예민해지고 작은 변화에도 크게 신경 쓸 수 있습니다.",
            failure: "실패의 여운이 오래 남아 감정적으로 힘든 시간이 길어질 수 있습니다.",
            conflict: "상대의 말투나 표정 변화를 실제보다 크게 받아들일 수 있습니다.",
            unrecognized: "인정받지 못한다고 느끼면 스스로 위축되며 표현을 줄이려 할 수 있습니다.",
            recovery: "회복 팁: 지금 느끼는 감정이 사실인지 추측인지 한 번 구분해보는 시간을 가져보세요."
        },
        communication: {
            speak: "느낀 감정과 분위기를 함께 담아 표현하는 편입니다.",
            energized: "내 감정을 있는 그대로 인정받고 공감받을 때 힘을 얻습니다.",
            drained: "감정을 무시당하거나 지나치게 사무적으로 대할 때 위축될 수 있습니다.",
            conflictCaution: "갈등 상황에서는 추측 대신 상대의 의도를 직접 물어보세요.",
            goodToKnow: "이 사람과 대화할 때는 사실 전달과 함께 감정을 한 번 알아봐 주는 것이 도움이 됩니다."
        }
    },
    interpersonal: {
        oneLiner: "사람과 관계 속에서 에너지를 얻고, 함께할 때 힘을 발휘하는 연결형",
        keywords: ["공감력", "협력적", "친화력", "조율능력", "관계지향"],
        environment: "사람들과 협업하거나 관계를 조율해야 하는 일, 팀의 분위기를 만들고 이끌어야 할 때 강점이 잘 드러납니다.",
        perception: "주변에서는 \"함께 있으면 편하다\", \"분위기를 잘 만든다\"는 평가를 받기 쉽습니다.",
        shadow: [
            { trait: "공감력", downside: "지나치면 타인의 감정에 쉽게 휘둘릴 수 있음" },
            { trait: "관계 지향성", downside: "지나치면 자신의 의견을 뒤로 미루게 될 수 있음" }
        ],
        blocker: {
            tendency: "타인의 평가나 반응을 지나치게 의식해 자신의 선택을 미루는 경향",
            neglect: "다른 사람 기준에 계속 맞추다 정작 자신이 원하는 것을 알기 어려워질 수 있어요.",
            grow: "작은 의견부터 먼저 말해보는 연습을 하면 관계 능력이 자기 주도성과 함께 성장합니다."
        },
        coaching: [
            "이번 주 하루 한 번, 내 의견을 다른 사람보다 먼저 말해보기",
            "부탁을 받았을 때 바로 수락하지 말고 잠깐 생각할 시간을 가져보기",
            "결정 전, '내가 원하는 것'을 먼저 한 문장으로 적어보기"
        ],
        stress: {
            pressure: "다른 사람의 반응을 더 신경 쓰며 자기 의견을 뒤로 미룰 수 있습니다.",
            failure: "주변에 어떻게 보일지 걱정하며 혼자 감정을 삭이려 할 수 있습니다.",
            conflict: "관계가 어색해질까 봐 불편함을 참다가 한꺼번에 서운함이 터질 수 있습니다.",
            unrecognized: "인정받지 못한다고 느끼면 더 맞춰주려 하며 스스로를 지치게 할 수 있습니다.",
            recovery: "회복 팁: 지금 느끼는 서운함을 작게라도 상대에게 말로 표현해보세요."
        },
        communication: {
            speak: "상대의 반응을 살피며 부드럽게 표현하는 편입니다.",
            energized: "관심과 인정을 받거나 함께한다는 느낌을 받을 때 힘을 얻습니다.",
            drained: "무시당하거나 혼자 결정을 내려야 하는 상황에서 스트레스를 받을 수 있습니다.",
            conflictCaution: "갈등 상황에서는 참기보다 작은 불편함부터 먼저 말해보세요.",
            goodToKnow: "이 사람과 대화할 때는 명확한 기준을 먼저 알려주면 오히려 관계가 더 편해집니다."
        }
    },
    intrapersonal: {
        oneLiner: "혼자만의 시간에 생각을 정리하고, 스스로 방향을 찾아가는 성찰형",
        keywords: ["자기이해", "독립적", "신중함", "목표지향", "내면성찰"],
        environment: "혼자 집중해서 생각을 정리하거나, 스스로 목표를 세우고 방향을 결정해야 하는 상황에서 강점이 잘 드러납니다.",
        perception: "주변에서는 \"자기 중심이 뚜렷하다\", \"쉽게 흔들리지 않는다\"는 평가를 받기 쉽습니다.",
        shadow: [
            { trait: "독립적 사고", downside: "지나치면 혼자 판단하고 주변과 공유하지 않을 수 있음" },
            { trait: "신중한 성찰", downside: "지나치면 생각만 길어지고 행동으로 옮기지 못할 수 있음" }
        ],
        blocker: {
            tendency: "완벽하게 정리될 때까지 밖으로 꺼내지 않고 혼자 담아두는 경향",
            neglect: "생각은 계속 쌓이지만 실제 행동이나 공유로 이어지지 못할 수 있어요.",
            grow: "정리가 끝나기 전이라도 지금 상태를 짧게 공유하는 연습을 하면 성찰이 실행으로 이어집니다."
        },
        coaching: [
            "이번 주 완전히 정리되지 않은 생각이라도 하나 공유해보기",
            "혼자 결정하기 전, 믿을 만한 사람 한 명에게 의견을 물어보기",
            "하루 한 번, 오늘 느낀 것을 짧게 기록해보기"
        ],
        stress: {
            pressure: "혼자 생각할 시간을 더 필요로 하며 주변과 거리를 둘 수 있습니다.",
            failure: "혼자 원인을 곱씹으며 스스로에게 엄격해질 수 있습니다.",
            conflict: "생각이 정리될 때까지 침묵하다 상대에게는 거리를 두는 것처럼 보일 수 있습니다.",
            unrecognized: "겉으로 드러내지 않지만 내적으로는 크게 신경 쓸 수 있습니다.",
            recovery: "회복 팁: 완벽한 정리 대신 지금 감정을 짧은 한 문장으로 표현해보는 것부터 시작해보세요."
        },
        communication: {
            speak: "충분히 생각을 정리한 뒤 필요한 말만 하는 편입니다.",
            energized: "생각할 시간을 존중받고 스스로 선택할 여지를 받을 때 힘을 얻습니다.",
            drained: "즉각적인 반응을 재촉받거나 사적인 생각을 강제로 공유해야 할 때 부담을 느낍니다.",
            conflictCaution: "갈등 상황에서는 침묵만 하기보다 정리할 시간이 필요하다고 짧게 알려주세요.",
            goodToKnow: "이 사람과 대화할 때는 바로 답을 재촉하기보다 생각할 시간을 주는 것이 도움이 됩니다."
        }
    },
    naturalistic: {
        oneLiner: "작은 차이와 패턴을 알아차리고, 꾸준히 관찰하며 정리하는 탐구형",
        keywords: ["관찰력", "꼼꼼함", "분류능력", "인내심", "현실감각"],
        environment: "세부 사항을 비교·분류하거나 반복되는 패턴을 관찰하고 기록해야 하는 일, 현장의 변화를 꾸준히 살펴야 할 때 강점이 잘 드러납니다.",
        perception: "주변에서는 \"꼼꼼하다\", \"작은 변화도 잘 알아차린다\"는 평가를 받기 쉽습니다.",
        shadow: [
            { trait: "세밀한 관찰력", downside: "지나치면 사소한 오류에 집착하며 전체 맥락을 놓칠 수 있음" },
            { trait: "꼼꼼함", downside: "지나치면 완결에 대한 부담으로 속도가 느려질 수 있음" }
        ],
        blocker: {
            tendency: "익숙하고 검증된 방식만 선택하며 새로운 시도를 미루는 경향",
            neglect: "안전한 선택만 반복하다 새로운 기회나 성장 경험을 놓칠 수 있어요.",
            grow: "작은 범위에서부터 낯선 시도를 해보면 관찰력이 새로운 통찰로 확장됩니다."
        },
        coaching: [
            "이번 주 평소와 다른 새로운 방식을 하나 시도해보기",
            "결정할 때 완벽한 정보가 없어도 진행할 기준을 미리 정해두기",
            "하루 한 번, 익숙하지 않은 선택을 작게라도 해보기"
        ],
        stress: {
            pressure: "더 많은 정보와 확인을 요구하며 신중함이 지나치게 커질 수 있습니다.",
            failure: "무엇이 어긋났는지 세부적으로 되짚으며 자책이 길어질 수 있습니다.",
            conflict: "상대의 실수나 오류가 먼저 눈에 띄어 지적부터 하게 될 수 있습니다.",
            unrecognized: "노력한 세부 과정이 인정받지 못한다고 느끼면 서운함이 쌓일 수 있습니다.",
            recovery: "회복 팁: 완벽한 정리보다 지금까지 확인된 것만으로 다음 걸음을 정해보세요."
        },
        communication: {
            speak: "구체적인 근거와 세부 사항을 함께 짚어가며 설명하는 편입니다.",
            energized: "노력한 과정과 세부적인 정성을 알아봐 줄 때 힘을 얻습니다.",
            drained: "대충 넘어가거나 세부 사항이 무시될 때 답답함을 느낄 수 있습니다.",
            conflictCaution: "갈등 상황에서는 오류를 지적하기 전에 잘된 점을 먼저 말해보세요.",
            goodToKnow: "이 사람과 대화할 때는 전체 방향에 대한 인정을 먼저 표현하면 더 편하게 받아들입니다."
        }
    }
};

// --------------------------------------
// 의사결정 스타일: 8종 고정 템플릿이 아니라
// 검사자의 원시 성향 점수(result.traits)를 그대로 활용해
// 같은 상위 유형이어도 사람마다 조금씩 다른 결과가 나오게 한다.
// --------------------------------------
function computeDecisionStyle(traits) {
    const t = traits || {};
    const num = v => Number.isFinite(Number(v)) ? Number(v) : 0;

    const speedScore =
        (num(t.execution) + num(t.selfDirection)) -
        (num(t.focus) + num(t.selfReflection));

    const basisScore =
        num(t.intuition) - num(t.logic);

    const modeScore =
        num(t.selfDirection) - num(t.interpersonal);

    const speed =
        speedScore >= 0
            ? { label: "빠른 결정형", note: "상황 판단이 서면 곧바로 움직이는 편입니다." }
            : { label: "충분한 검토형", note: "여러 가능성을 살펴본 뒤 결정하는 편입니다." };

    const basis =
        basisScore >= 0
            ? { label: "직관 중심형", note: "느낌과 전체적인 감으로 방향을 잡는 편입니다." }
            : { label: "근거 중심형", note: "데이터와 사실을 먼저 확인하고 판단하는 편입니다." };

    const mode =
        modeScore >= 0
            ? { label: "혼자 판단형", note: "스스로 결론을 내리고 책임지는 것을 편하게 느낍니다." }
            : { label: "의견 수렴형", note: "주변 의견을 들은 뒤 결정하는 것을 편하게 느낍니다." };

    const pitfalls = [];

    if (speedScore >= 0 && basisScore >= 0) {
        pitfalls.push("속도감에 취해 반박 시나리오를 점검하지 않고 넘어갈 수 있어요. 결정 전 '이게 틀렸다면?'을 한 번 물어보세요.");
    } else if (speedScore < 0 && basisScore < 0) {
        pitfalls.push("확신이 설 때까지 검토가 길어질 수 있어요. 결정 마감 시한을 미리 정해두는 것이 도움이 됩니다.");
    } else if (speedScore >= 0 && basisScore < 0) {
        pitfalls.push("근거를 확인하는 중간에도 서둘러 결론으로 넘어갈 수 있어요. 핵심 근거 1~2가지만은 꼭 확인하고 움직여보세요.");
    } else {
        pitfalls.push("감이 있음에도 검증에 시간을 오래 쓸 수 있어요. 직관을 하나의 가설로 보고 빠르게 검증해보는 것도 방법입니다.");
    }

    if (mode.label === "혼자 판단형") {
        pitfalls.push("주변과 공유하지 않고 결정해 나중에 설득 비용이 커질 수 있으니, 중요한 결정은 한 번쯤 다른 사람에게 미리 알려보세요.");
    } else {
        pitfalls.push("여러 의견을 듣다가 결정이 계속 미뤄질 수 있으니, 의견을 들을 사람의 수를 미리 정해두는 것이 도움이 됩니다.");
    }

    return { speed, basis, mode, pitfalls };
}

function setReportHtml(id, html) {
    const element =
        document.getElementById(id);

    if (element) {
        element.innerHTML = html;
    }
}

function renderDetailedReport(result, fingerprintData) {
    const ranking =
        Array.isArray(result?.ranking)
            ? result.ranking.filter(item =>
                item &&
                item.key &&
                REPORT_INFO[item.key]
            )
            : [];

    if (!ranking.length) {
        console.warn("상세 리포트용 ranking 데이터가 없습니다.");
        return;
    }

    const top3 =
        ranking.slice(
            0,
            Math.min(3, ranking.length)
        );

    const low2 =
        ranking.slice(-2).reverse();

    const enhancedReport =
        document.getElementById(
            "enhancedReport"
        );

    if (enhancedReport) {
        enhancedReport.className =
            "enhanced-report " +
            (
                REPORT_THEME[top3[0]?.key] ||
                "theme-blue"
            );
    }

    const modeBadge =
        document.getElementById(
            "reportModeBadge"
        );

    if (modeBadge) {
        modeBadge.textContent =
            testMode === "simple"
                ? "간편검사 · 4개 지문 · 각 1회"
                : "정밀검사 · 10개 지문 · 각 1회";
    }

    const topNames =
        top3
            .map(item => item.name)
            .filter(Boolean)
            .join(" · ");

    const first =
        top3[0] || ranking[0];

    const second =
        top3[1];

    const third =
        top3[2];

    setReportHtml(
        "coreSummary",
        `<strong>${topNames}</strong>
        <p>이번 결과에서는 <b>${first?.name || "주요 성향"}</b> 영역이 상대적으로 높게 나타났습니다.${
            second
                ? ` ${second.name}${third ? `, ${third.name}` : ""} 영역도 함께 살펴볼 수 있습니다.`
                : ""
        } 상위 영역의 특징을 활동과 환경을 탐색하는 참고자료로 활용해보세요.</p>`
    );

    setReportHtml(
        "strengthTop3",
        top3.map((x,i)=>`
            <article class="strength-card">
                <div class="rank-label">TOP ${i+1}</div>
                <h4>${x.name}<span>${Number.isFinite(Number(x.score)) ? x.score : "-"}점</span></h4>
                <p>${REPORT_INFO[x.key]?.strength || ""}</p>
            </article>`
        ).join("")
    );

    const careers=[];

    top3.forEach(x => {
        const items =
            REPORT_INFO[x.key]?.careers || [];

        items.forEach(c => {
            if (!careers.includes(c)) {
                careers.push(c);
            }
        });
    });

    setReportHtml(
        "careerRecommendations",
        careers.slice(0,9)
            .map(c=>`<span>${c}</span>`)
            .join("") +
        `<p class="report-note">직업·역할은 진로 판정이 아니라 상위 영역을 활용해볼 수 있는 활동 분야의 예시입니다.</p>`
    );

    setReportHtml(
        "growthPoints",
        low2.map(x=>`
            <div class="compact-insight">
                <b>${x.name} · ${Number.isFinite(Number(x.score)) ? x.score : "-"}점</b>
                <p>${REPORT_INFO[x.key]?.growth || ""}</p>
            </div>`
        ).join("")
    );

    setReportHtml(
        "relationshipStrengths",
        top3.slice(0,2).map(x=>`
            <div class="compact-insight">
                <b>${x.name}</b>
                <p>${REPORT_INFO[x.key]?.relS || ""}</p>
            </div>`
        ).join("")
    );

    setReportHtml(
        "relationshipCautions",
        top3.slice(0,2).map(x=>{
            const d =
                RELATIONSHIP_DETAIL[x.key];

            if (!d) {
                return `
                    <article class="relationship-detail-card">
                        <div class="relationship-detail-title">${x.name}</div>
                        <p>${REPORT_INFO[x.key]?.relC || ""}</p>
                    </article>`;
            }

            return `
                <article class="relationship-detail-card">
                    <div class="relationship-detail-title">${x.name}</div>
                    <div><b>갈등 상황에서 나타날 수 있는 모습</b><p>${d.conflict || ""}</p></div>
                    <div><b>상대가 필요로 할 수 있는 것</b><p>${d.otherNeeds || ""}</p></div>
                    <div><b>관계에서 연습하면 좋은 행동</b><p>${d.practice || ""}</p></div>
                    <div class="relationship-phrase"><b>도움이 되는 표현</b><span>${d.phrase || ""}</span></div>
                </article>`;
        }).join("")
    );

    const learningDescription =
        result?.learningStyle?.description ||
        "상위 성향을 활용해 시각화, 설명, 반복, 체험 등 여러 방식을 조합해보세요.";

    setReportHtml(
        "workStudyStyle",
        `<p class="engine-style">${learningDescription}</p>` +
        top3.slice(0,2).map(x=>`
            <div class="insight-line">
                <b>${x.name}</b> — ${REPORT_INFO[x.key]?.work || ""}
            </div>`
        ).join("")
    );

    setReportHtml(
        "allAreaAnalysis",
        ranking.map(x=>{
            const score =
                Number.isFinite(Number(x.score))
                    ? Number(x.score)
                    : 0;

            const level =
                score >= 75 ? "높게 나타남" :
                score >= 60 ? "상대적 강점" :
                score >= 45 ? "균형 영역" :
                "성장 아이디어 영역";

            return `
                <div class="area-row">
                    <div class="area-head">
                        <b>${x.name}</b>
                        <span>${score} · ${level}</span>
                    </div>
                    <div class="area-track">
                        <i style="width:${Math.max(0,Math.min(100,score))}%"></i>
                    </div>
                </div>`;
        }).join("")
    );

    // ====================================
    // v9 확장 섹션: PERSONA_INFO 기반
    // ====================================
    const persona =
        PERSONA_INFO[first?.key] || null;

    if (persona) {

        setReportHtml(
            "oneLinerSummary",
            `<p class="one-liner">“${persona.oneLiner}”</p>
            <div class="career-chips">
                ${persona.keywords.map(k => `<span>${k}</span>`).join("")}
            </div>`
        );

        setReportHtml(
            "strengthEnvironment",
            `<div class="compact-insight">
                <b>어떤 상황에서 빛나는가</b>
                <p>${persona.environment}</p>
            </div>
            <div class="compact-insight">
                <b>주변에서 보는 시선</b>
                <p>${persona.perception}</p>
            </div>`
        );

        setReportHtml(
            "strengthShadow",
            persona.shadow.map(s => `
                <div class="compact-insight">
                    <b>${s.trait}</b>
                    <p>${s.downside}</p>
                </div>`
            ).join("") +
            `<p class="report-note">모든 강점은 지나치면 약점이 될 수 있습니다. 단점이 아니라 강점을 조절하는 힌트로 봐주세요.</p>`
        );

        const roleFirst =
            ROLE_LABELS[first?.key];

        const roleSecond =
            second ? ROLE_LABELS[second.key] : null;

        setReportHtml(
            "matchingRoles",
            `<div class="report-grid two">
                <div class="compact-insight">
                    <b>주로 발휘하기 좋은 역할 — ${roleFirst?.primary || "-"}</b>
                    <p>${first?.name || ""} 강점을 살리기 가장 쉬운 역할입니다.</p>
                </div>
                ${
                    roleSecond
                        ? `<div class="compact-insight">
                            <b>함께 발휘하기 좋은 역할 — ${roleSecond.primary}</b>
                            <p>${second.name} 강점과 함께 쓰면 시너지가 나는 역할입니다.</p>
                        </div>`
                        : ""
                }
            </div>
            <p class="report-note">구체적인 직업 예시는 위 '추천 직업·역할'을 함께 참고해보세요.</p>`
        );

        setReportHtml(
            "growthBlocker",
            `<div class="compact-insight">
                <b>${persona.blocker.tendency}</b>
                <p><b>방치하면</b> ${persona.blocker.neglect}</p>
                <p><b>성장시키면</b> ${persona.blocker.grow}</p>
            </div>`
        );

        setReportHtml(
            "growthCoaching",
            `<p class="engine-style">당신에게 필요한 것은 더 많은 고민보다 작은 실행입니다.</p>
            <div class="career-chips">
                ${persona.coaching.map(c => `<span>${c}</span>`).join("")}
            </div>`
        );

        setReportHtml(
            "communicationStyle",
            `<article class="relationship-detail-card">
                <div class="relationship-detail-title">${first?.name || ""} 기준 소통 스타일</div>
                <div><b>나는 어떻게 말하는 편인가</b><p>${persona.communication.speak}</p></div>
                <div><b>힘을 얻는 대화</b><p>${persona.communication.energized}</p></div>
                <div><b>스트레스를 받는 대화</b><p>${persona.communication.drained}</p></div>
                <div><b>갈등 시 주의점</b><p>${persona.communication.conflictCaution}</p></div>
                <div class="relationship-phrase"><b>상대가 알아두면 좋은 점</b><span>${persona.communication.goodToKnow}</span></div>
            </article>`
        );

        setReportHtml(
            "stressResponse",
            `<article class="relationship-detail-card">
                <div class="relationship-detail-title">압박 상황에서 나타날 수 있는 모습</div>
                <div><b>압박을 받을 때</b><p>${persona.stress.pressure}</p></div>
                <div><b>실패했을 때</b><p>${persona.stress.failure}</p></div>
                <div><b>갈등이 생겼을 때</b><p>${persona.stress.conflict}</p></div>
                <div><b>인정받지 못한다고 느낄 때</b><p>${persona.stress.unrecognized}</p></div>
                <div class="relationship-phrase"><b>${persona.stress.recovery}</b></div>
            </article>`
        );
    }

    const decision =
        computeDecisionStyle(result?.traits);

    if (decision) {
        setReportHtml(
            "decisionStyle",
            `<div class="report-grid three">
                <div class="strength-card">
                    <div class="rank-label">속도</div>
                    <h4>${decision.speed.label}</h4>
                    <p>${decision.speed.note}</p>
                </div>
                <div class="strength-card">
                    <div class="rank-label">기준</div>
                    <h4>${decision.basis.label}</h4>
                    <p>${decision.basis.note}</p>
                </div>
                <div class="strength-card">
                    <div class="rank-label">방식</div>
                    <h4>${decision.mode.label}</h4>
                    <p>${decision.mode.note}</p>
                </div>
            </div>
            <div class="compact-insight">
                <b>결정할 때 주의할 함정</b>
                <p>${decision.pitfalls.join(" ")}</p>
            </div>`
        );
    }

    // ====================================
    // 손가락별 판독 결과 (판정 근거 공개)
    // ====================================
    if (fingerprintData && typeof fingerprintData === "object") {

        const rows =
            fingers
                .filter(f => fingerprintData[f.key])
                .map(f => {
                    const d = fingerprintData[f.key];
                    const patternKey =
                        d.pattern || d.effectivePattern || d.fallbackCandidate;
                    const label =
                        (typeof FingerprintEngine !== "undefined" &&
                         FingerprintEngine.patterns?.[patternKey]?.label) ||
                        patternKey || "-";
                    const confidence =
                        Number.isFinite(Number(d.confidence))
                            ? `${Math.round(Number(d.confidence))}%`
                            : "-";

                    return `
                        <div class="finger-row">
                            <span>${f.hand} ${f.name}</span>
                            <span>${label} · 신뢰도 ${confidence}</span>
                        </div>`;
                }).join("");

        setReportHtml(
            "fingerprintTypesSummary",
            rows
                ? `<div class="finger-table">${rows}</div>
                   <p class="report-note">지문 유형 판별은 촬영 사진의 융선 방향·곡률을 근사 분석한 결과이며, 정밀 감식 수준의 판독이 아닙니다.</p>`
                : ""
        );
    }
}

// ==========================================
// 결과 화면 렌더링
// ==========================================

function renderResult(
    result,
    fingerprintData
) {
    if (resultParticipant) {
        resultParticipant.textContent =
            participant.name
                ? `${participant.name}님의 지문 데이터 기반 분석 결과`
                : "현재 검사자의 지문 데이터 기반 분석 결과";
    }

    // 현재 결과지에 실제로 존재하는 상세 리포트만 렌더링합니다.
    // 과거에 삭제된 TOP3/손가락 결과/중복 점수 DOM에는 접근하지 않습니다.
    renderDetailedReport(
        result,
        fingerprintData
    );
}


// ==========================================
// 새 검사
// ==========================================

restartBtn.addEventListener(
    "click",
    function () {

        
        resetAllTestData();
currentIndex = 0;
        fingerprintImages = {};
        repeatCaptures = {};
        fingers = [...fullFingers];
        testMode = "full";

        nameInput.value = "";
        birthInput.value = "";
        consultantInput.value = "";

        previewArea.style.border = "";

        showScreen(
            startScreen
        );

        nameInput.focus();
    }
);


// ==========================================
// 결과 PDF
// ==========================================


// ==========================================
// v7.5 PDF 전용 문서 생성
// ==========================================
function printResultAsPdf() {

    const report =
        document.getElementById(
            "enhancedReport"
        );

    if (!report) {
        alert(
            "PDF로 저장할 결과를 찾을 수 없습니다."
        );
        return;
    }

    const participantText =
        resultParticipant?.textContent ||
        "FINGER IQ 분석 결과";

    // 현재 성향 컬러를 실제 계산값으로 가져옵니다.
    const computed =
        window.getComputedStyle(report);

    const accent =
        computed.getPropertyValue("--accent").trim() ||
        "#315ea8";

    const accentSoft =
        computed.getPropertyValue("--accent-soft").trim() ||
        "#edf4ff";

    const accentDeep =
        computed.getPropertyValue("--accent-deep").trim() ||
        "#1f427c";

    // 인쇄 문서는 앱 화면과 분리하여 iframe 안에 독립적으로 생성합니다.
    let frame =
        document.getElementById(
            "pdfPrintFrame"
        );

    if (frame) {
        frame.remove();
    }

    frame =
        document.createElement(
            "iframe"
        );

    frame.id =
        "pdfPrintFrame";

    frame.setAttribute(
        "aria-hidden",
        "true"
    );

    frame.style.position =
        "fixed";

    frame.style.right =
        "0";

    frame.style.bottom =
        "0";

    frame.style.width =
        "1px";

    frame.style.height =
        "1px";

    frame.style.border =
        "0";

    frame.style.opacity =
        "0";

    document.body.appendChild(
        frame
    );

    const doc =
        frame.contentWindow.document;

    const reportHtml =
        report.outerHTML;

    doc.open();

    doc.write(`
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>FINGER IQ 결과지</title>
<style>
@page {
    size: A4 portrait;
    margin: 7mm;
}

* {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}

html, body {
    margin: 0;
    padding: 0;
    background: #fff;
    color: #222;
    font-family: Arial, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
}

.pdf-page {
    width: 196mm;
    margin: 0 auto;
    background: #fff;
}

.pdf-title {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 10px;
    padding: 0 0 3mm;
    margin-bottom: 2mm;
    border-bottom: 2px solid ${accent};
}

.pdf-title .brand {
    font-size: 7pt;
    font-weight: 800;
    letter-spacing: 1.4pt;
    color: ${accentDeep};
}

.pdf-title h1 {
    margin: 1mm 0 0;
    font-size: 15pt;
}

.pdf-participant {
    font-size: 7pt;
    color: #666;
    text-align: right;
}

.enhanced-report {
    --accent: ${accent};
    --accent-soft: ${accentSoft};
    --accent-deep: ${accentDeep};
    width: 100%;
    margin: 0;
    text-align: left;
}

.report-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
    padding-bottom: 1.8mm;
    border-bottom: 1.5px solid ${accent};
}

.report-head h2 {
    margin: 0.5mm 0 0;
    font-size: 10pt;
}

.report-kicker {
    font-size: 5pt;
    font-weight: 800;
    letter-spacing: 1.3pt;
    color: ${accentDeep};
}

.report-mode-badge {
    padding: 1mm 2mm;
    border: 1px solid ${accent};
    border-radius: 99px;
    background: ${accentSoft};
    color: ${accentDeep};
    font-size: 5pt;
    white-space: nowrap;
}

.report-section {
    margin-top: 1.4mm;
    padding: 1.7mm 2mm;
    border: 1px solid #e3e5e8;
    border-radius: 1.8mm;
    background: #fff;
    break-inside: avoid;
    page-break-inside: avoid;
}

.report-section h3 {
    margin: 0 0 0.7mm;
    color: ${accentDeep};
    font-size: 6.1pt;
}

#coreSummary strong {
    display: block;
    margin-bottom: 0.4mm;
    font-size: 7.3pt;
}

#coreSummary p,
.strength-card p,
.compact-insight p,
.insight-line,
.engine-style,
.report-note {
    margin: 0;
    color: #555;
    font-size: 4.5pt;
    line-height: 1.17;
}

.report-grid {
    display: grid;
    gap: 1mm;
}

.report-grid.three {
    grid-template-columns: repeat(3, minmax(0,1fr));
}

.report-grid.two {
    grid-template-columns: repeat(2, minmax(0,1fr));
    margin-top: 1.4mm;
}

.report-grid.two > .report-section {
    margin-top: 0;
}

.strength-card {
    padding: 1.3mm;
    border-radius: 1.5mm;
    background: ${accentSoft};
}

.rank-label {
    color: ${accentDeep};
    font-size: 4.2pt;
    font-weight: 800;
}

.strength-card h4 {
    margin: 0.3mm 0 0.5mm;
    font-size: 5.4pt;
}

.strength-card h4 span {
    float: right;
    color: #666;
    font-size: 4.6pt;
}

.career-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6mm;
}

.career-chips > span {
    padding: 0.6mm 1.1mm;
    border-radius: 99px;
    background: ${accentSoft};
    color: ${accentDeep};
    font-size: 4.4pt;
}

.career-chips .report-note {
    flex-basis: 100%;
    margin-top: 0.4mm;
}

.compact-insight + .compact-insight,
.insight-line + .insight-line {
    margin-top: 0.6mm;
}

.compact-insight b,
.insight-line b {
    font-size: 4.9pt;
}

.relationship-detail-card {
    padding: 1.1mm;
    border: 1px solid #e7e7e7;
    border-radius: 1.4mm;
    background: #fafafa;
    break-inside: avoid;
}

.relationship-detail-card + .relationship-detail-card {
    margin-top: 0.7mm;
}

.relationship-detail-title {
    margin-bottom: 0.5mm;
    color: ${accentDeep};
    font-size: 5.3pt;
    font-weight: 800;
}

.relationship-detail-card > div:not(.relationship-detail-title) {
    margin-top: 0.35mm;
}

.relationship-detail-card b,
.relationship-detail-card p,
.relationship-phrase span {
    font-size: 4.15pt;
    line-height: 1.12;
}

.relationship-detail-card p {
    margin: 0.15mm 0 0;
    color: #555;
}

.relationship-phrase {
    padding: 0.6mm;
    border-radius: 1mm;
    background: ${accentSoft};
}

.relationship-phrase span {
    display: block;
    margin-top: 0.2mm;
    color: ${accentDeep};
    font-weight: 700;
}

#allAreaAnalysis {
    display: grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 0.6mm 2.5mm;
}

.area-head {
    display: flex;
    justify-content: space-between;
    gap: 4px;
    margin-bottom: 0.3mm;
    font-size: 4.3pt;
}

.area-head span {
    color: #777;
}

.area-track {
    height: 0.55mm;
    overflow: hidden;
    border-radius: 99px;
    background: #e9eaec;
}

.area-track i {
    display: block;
    height: 100%;
    background: ${accent};
}

.area-meaning-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 0.45mm 2.5mm;
}

.area-meaning-grid > div {
    display: flex;
    flex-direction: column;
    gap: 0.1mm;
    padding-bottom: 0.35mm;
    border-bottom: 1px solid #eee;
}

.area-meaning-grid b {
    font-size: 4.3pt;
}

.area-meaning-grid span {
    color: #666;
    font-size: 4pt;
    line-height: 1.1;
}

.report-disclaimer {
    margin-top: 1mm;
    padding: 0.8mm;
    border-radius: 1mm;
    background: ${accentSoft};
    color: ${accentDeep};
    text-align: center;
    font-size: 4.1pt;
}

/* 결과지 내부에서 화면 전용으로 남아 있을 수 있는 요소 제거 */
.pdf-btn,
.restart-btn,
button {
    display: none !important;
}

@media print {
    html, body, .pdf-page {
        width: auto;
        margin: 0;
    }
}
</style>
</head>
<body>
<div class="pdf-page">
    <div class="pdf-title">
        <div>
            <div class="brand">FINGER IQ REPORT</div>
            <h1>개인 성향 분석 결과지</h1>
        </div>
        <div class="pdf-participant">${participantText}</div>
    </div>
    ${reportHtml}
</div>
</body>
</html>
    `);

    doc.close();

    // iframe 문서가 실제 레이아웃을 완성한 뒤 인쇄 창을 엽니다.
    setTimeout(
        () => {
            try {
                frame.contentWindow.focus();
                frame.contentWindow.print();
            } catch (error) {
                console.error(
                    "PDF 인쇄 오류:",
                    error
                );

                alert(
                    "PDF 저장 화면을 열지 못했습니다. 브라우저의 팝업/인쇄 권한을 확인해주세요."
                );
            }

            setTimeout(
                () => {
                    frame.remove();
                },
                1500
            );
        },
        350
    );
}


if (pdfBtn) {
    pdfBtn.addEventListener(
        "click",
        () => {
            printResultAsPdf();
        }
    );
}
