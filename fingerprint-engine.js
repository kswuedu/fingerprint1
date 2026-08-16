// ==========================================
// FINGER IQ 2.0 PERSONALIZED
// 지문 기반 다중지능 성향 분석 엔진
// ==========================================

const FingerprintEngine = (() => {

    // --------------------------------------
    // 1. 지문 유형
    // --------------------------------------

    const PATTERNS = {

        ARCH: {
            name: "Arch",
            label: "아치형",
            traits: {
                selfDirection: 7,
                logic: 7,
                focus: 8,
                execution: 7,
                creativity: 6,
                emotion: 5,
                intuition: 6,
                language: 5,
                interpersonal: 5,
                selfReflection: 7,
                bodySense: 6,
                natureSense: 7
            }
        },

        TENTED_ARCH: {
            name: "Tented Arch",
            label: "텐트형 아치",
            traits: {
                selfDirection: 8,
                logic: 8,
                focus: 8,
                execution: 8,
                creativity: 7,
                emotion: 5,
                intuition: 7,
                language: 5,
                interpersonal: 5,
                selfReflection: 7,
                bodySense: 6,
                natureSense: 6
            }
        },

        LOOP: {
            name: "Loop",
            label: "루프형",
            traits: {
                selfDirection: 6,
                logic: 6,
                focus: 7,
                execution: 7,
                creativity: 7,
                emotion: 7,
                intuition: 7,
                language: 7,
                interpersonal: 8,
                selfReflection: 6,
                bodySense: 7,
                natureSense: 6
            }
        },

        RADIAL_LOOP: {
            name: "Radial Loop",
            label: "방사형 루프",
            traits: {
                selfDirection: 8,
                logic: 7,
                focus: 7,
                execution: 7,
                creativity: 8,
                emotion: 6,
                intuition: 8,
                language: 8,
                interpersonal: 7,
                selfReflection: 7,
                bodySense: 6,
                natureSense: 6
            }
        },

        WHORL: {
            name: "Whorl",
            label: "소용돌이형",
            traits: {
                selfDirection: 9,
                logic: 8,
                focus: 8,
                execution: 8,
                creativity: 8,
                emotion: 6,
                intuition: 8,
                language: 6,
                interpersonal: 6,
                selfReflection: 8,
                bodySense: 6,
                natureSense: 6
            }
        },

        CENTRAL_POCKET: {
            name: "Central Pocket Loop",
            label: "중심주머니형",
            traits: {
                selfDirection: 8,
                logic: 9,
                focus: 9,
                execution: 7,
                creativity: 7,
                emotion: 5,
                intuition: 7,
                language: 6,
                interpersonal: 5,
                selfReflection: 8,
                bodySense: 5,
                natureSense: 5
            }
        },

        DOUBLE_LOOP: {
            name: "Double Loop",
            label: "이중 루프",
            traits: {
                selfDirection: 7,
                logic: 8,
                focus: 8,
                execution: 7,
                creativity: 9,
                emotion: 7,
                intuition: 9,
                language: 7,
                interpersonal: 8,
                selfReflection: 8,
                bodySense: 6,
                natureSense: 7
            }
        },

        COMPOSITE: {
            name: "Composite",
            label: "복합형",
            traits: {
                selfDirection: 8,
                logic: 8,
                focus: 7,
                execution: 7,
                creativity: 9,
                emotion: 8,
                intuition: 9,
                language: 8,
                interpersonal: 8,
                selfReflection: 8,
                bodySense: 7,
                natureSense: 7
            }
        }

    };


    // --------------------------------------
    // 2. 10개 손가락 가중치
    // --------------------------------------

    const FINGER_WEIGHTS = {

        left_thumb: {
            selfDirection: 1.20,
            logic: 1.00,
            focus: 0.90,
            execution: 1.10,
            creativity: 0.90,
            emotion: 0.80,
            intuition: 0.90,
            language: 0.80,
            interpersonal: 0.80,
            selfReflection: 1.00,
            bodySense: 0.90,
            natureSense: 0.70
        },

        left_index: {
            selfDirection: 1.00,
            logic: 1.20,
            focus: 1.10,
            execution: 0.90,
            creativity: 0.90,
            emotion: 0.70,
            intuition: 0.80,
            language: 1.00,
            interpersonal: 0.80,
            selfReflection: 0.90,
            bodySense: 0.70,
            natureSense: 0.70
        },

        left_middle: {
            selfDirection: 0.90,
            logic: 1.10,
            focus: 1.30,
            execution: 1.20,
            creativity: 0.80,
            emotion: 0.70,
            intuition: 0.70,
            language: 0.70,
            interpersonal: 0.70,
            selfReflection: 0.90,
            bodySense: 0.90,
            natureSense: 0.70
        },

        left_ring: {
            selfDirection: 0.80,
            logic: 0.70,
            focus: 0.80,
            execution: 0.80,
            creativity: 1.30,
            emotion: 1.20,
            intuition: 1.10,
            language: 0.90,
            interpersonal: 0.90,
            selfReflection: 0.90,
            bodySense: 1.00,
            natureSense: 1.00
        },

        left_little: {
            selfDirection: 0.70,
            logic: 0.70,
            focus: 0.70,
            execution: 0.70,
            creativity: 0.90,
            emotion: 1.00,
            intuition: 1.00,
            language: 1.30,
            interpersonal: 1.30,
            selfReflection: 1.00,
            bodySense: 0.80,
            natureSense: 0.80
        },

        right_thumb: {
            selfDirection: 1.30,
            logic: 1.00,
            focus: 0.90,
            execution: 1.30,
            creativity: 0.90,
            emotion: 0.70,
            intuition: 0.80,
            language: 0.70,
            interpersonal: 0.80,
            selfReflection: 0.80,
            bodySense: 1.00,
            natureSense: 0.70
        },

        right_index: {
            selfDirection: 1.10,
            logic: 1.20,
            focus: 1.00,
            execution: 1.10,
            creativity: 0.90,
            emotion: 0.70,
            intuition: 0.70,
            language: 1.00,
            interpersonal: 0.90,
            selfReflection: 0.80,
            bodySense: 0.70,
            natureSense: 0.70
        },

        right_middle: {
            selfDirection: 1.00,
            logic: 1.10,
            focus: 1.30,
            execution: 1.30,
            creativity: 0.70,
            emotion: 0.60,
            intuition: 0.60,
            language: 0.60,
            interpersonal: 0.60,
            selfReflection: 0.70,
            bodySense: 1.00,
            natureSense: 0.60
        },

        right_ring: {
            selfDirection: 0.80,
            logic: 0.70,
            focus: 0.80,
            execution: 0.90,
            creativity: 1.40,
            emotion: 1.30,
            intuition: 1.20,
            language: 0.90,
            interpersonal: 1.00,
            selfReflection: 0.90,
            bodySense: 1.00,
            natureSense: 1.00
        },

        right_little: {
            selfDirection: 0.80,
            logic: 0.80,
            focus: 0.70,
            execution: 0.80,
            creativity: 0.90,
            emotion: 1.00,
            intuition: 1.00,
            language: 1.40,
            interpersonal: 1.40,
            selfReflection: 1.00,
            bodySense: 0.80,
            natureSense: 0.80
        }

    };


    // --------------------------------------
    // 3. 성향 → 다중지능 연결
    // --------------------------------------

    const INTELLIGENCES = {

        linguistic: {
            name: "언어지능",
            traits: {
                language: 0.60,
                interpersonal: 0.20,
                selfReflection: 0.20
            }
        },

        logical: {
            name: "논리수학지능",
            traits: {
                logic: 0.65,
                focus: 0.20,
                selfReflection: 0.15
            }
        },

        spatial: {
            name: "공간지능",
            traits: {
                creativity: 0.40,
                intuition: 0.25,
                focus: 0.20,
                bodySense: 0.15
            }
        },

        bodily: {
            name: "신체운동지능",
            traits: {
                bodySense: 0.55,
                execution: 0.30,
                focus: 0.15
            }
        },

        musical: {
            name: "음악지능",
            traits: {
                emotion: 0.35,
                creativity: 0.30,
                intuition: 0.25,
                focus: 0.10
            }
        },

        interpersonal: {
            name: "대인관계지능",
            traits: {
                interpersonal: 0.55,
                emotion: 0.20,
                language: 0.15,
                intuition: 0.10
            }
        },

        intrapersonal: {
            name: "자기성찰지능",
            traits: {
                selfReflection: 0.55,
                selfDirection: 0.20,
                intuition: 0.15,
                focus: 0.10
            }
        },

        naturalistic: {
            name: "자연탐구지능",
            traits: {
                natureSense: 0.55,
                intuition: 0.20,
                focus: 0.15,
                bodySense: 0.10
            }
        }

    };


    // --------------------------------------
    // 4. 분석 실행
    // --------------------------------------

    function analyze(fingerprintData) {

        const traitScores = {};
        const traitWeights = {};

        const traitKeys =
            Object.keys(
                FINGER_WEIGHTS.left_thumb
            );

        traitKeys.forEach(trait => {
            traitScores[trait] = 0;
            traitWeights[trait] = 0;
        });

        const fingerDetails = {};

        // ----------------------------------
        // 손가락별 상세 데이터 반영
        // ----------------------------------
        Object.keys(fingerprintData)
            .forEach(fingerKey => {

                const raw =
                    fingerprintData[fingerKey];

                const weights =
                    FINGER_WEIGHTS[fingerKey];

                if (!weights) {
                    return;
                }

                // 과거 버전 호환:
                // "LOOP" 문자열만 들어와도 처리
                const patternKey =
                    typeof raw === "string"
                        ? raw
                        : (
                            raw.pattern ||
                            raw.effectivePattern ||
                            raw.fallbackCandidate ||
                            "UNKNOWN"
                          );

                // 후보확률
                const probabilities =
                    typeof raw === "object" &&
                    raw.probabilities
                        ? raw.probabilities
                        : (
                            typeof raw === "object" &&
                            raw.debug &&
                            raw.debug.probabilities
                                ? raw.debug.probabilities
                                : null
                          );

                // 패턴 혼합 traits 생성
                const mixedTraits = {};
                traitKeys.forEach(
                    trait =>
                        mixedTraits[trait] = 0
                );

                let probabilityTotal = 0;

                if (probabilities) {

                    Object.entries(
                        probabilities
                    ).forEach(
                        ([candidateKey, percent]) => {

                            const pattern =
                                PATTERNS[candidateKey];

                            const numeric =
                                Number(percent);

                            if (
                                !pattern ||
                                !Number.isFinite(numeric) ||
                                numeric <= 0
                            ) {
                                return;
                            }

                            const p =
                                numeric / 100;

                            probabilityTotal += p;

                            traitKeys.forEach(
                                trait => {

                                    mixedTraits[trait] +=
                                        (pattern.traits[trait] || 0) *
                                        p;
                                }
                            );
                        }
                    );
                }

                // 후보확률이 없으면 기존 확정 패턴 사용
                if (
                    probabilityTotal <= 0
                ) {

                    const fallbackPattern =
                        PATTERNS[patternKey];

                    if (!fallbackPattern) {
                        return;
                    }

                    traitKeys.forEach(
                        trait => {

                            mixedTraits[trait] =
                                fallbackPattern
                                    .traits[trait] || 0;
                        }
                    );

                    probabilityTotal = 1;
                } else if (
                    Math.abs(
                        probabilityTotal - 1
                    ) > 0.001
                ) {

                    traitKeys.forEach(
                        trait => {

                            mixedTraits[trait] =
                                mixedTraits[trait] /
                                probabilityTotal;
                        }
                    );
                }

                // 판독 신뢰 보정.
                // 값이 없어도 과거 버전과 동일하게 1.0 사용.
                const ridgeScore =
                    typeof raw === "object"
                        ? Number(
                            raw.ridgeScore ??
                            raw.debug?.ridgeScore ??
                            100
                          )
                        : 100;

                const confidence =
                    typeof raw === "object"
                        ? Number(
                            raw.confidence ??
                            raw.detectionConfidence ??
                            100
                          )
                        : 100;

                const coherence =
                    typeof raw === "object"
                        ? Number(
                            raw.coherence ??
                            raw.debug?.coherence ??
                            1
                          )
                        : 1;

                const qualityFactor =
                    Math.max(
                        0.55,
                        Math.min(
                            1,
                            (
                                Math.min(100, ridgeScore) / 100 * 0.45 +
                                Math.min(100, confidence) / 100 * 0.35 +
                                Math.min(1, coherence) * 0.20
                            )
                        )
                    );

                traitKeys.forEach(
                    trait => {

                        const weight =
                            weights[trait] || 1;

                        traitScores[trait] +=
                            mixedTraits[trait] *
                            weight *
                            qualityFactor;

                        traitWeights[trait] +=
                            weight *
                            qualityFactor;
                    }
                );

                fingerDetails[fingerKey] = {
                    pattern: patternKey,
                    probabilities:
                        probabilities || {
                            [patternKey]: 100
                        },
                    qualityFactor:
                        Math.round(
                            qualityFactor * 100
                        ) / 100,
                    ridgeScore:
                        Number.isFinite(ridgeScore)
                            ? ridgeScore
                            : null,
                    confidence:
                        Number.isFinite(confidence)
                            ? confidence
                            : null,
                    coherence:
                        Number.isFinite(coherence)
                            ? coherence
                            : null
                };
            });

        // ----------------------------------
        // 평균 성향 점수
        // ----------------------------------
        Object.keys(traitScores)
            .forEach(trait => {

                if (traitWeights[trait] > 0) {

                    traitScores[trait] =
                        traitScores[trait] /
                        traitWeights[trait];

                } else {

                    traitScores[trait] = 0;
                }
            });

        // ----------------------------------
        // 8대 지능 계산
        // ----------------------------------
        const intelligenceScores = {};

        Object.keys(INTELLIGENCES)
            .forEach(key => {

                const intelligence =
                    INTELLIGENCES[key];

                let score = 0;

                Object.keys(
                    intelligence.traits
                ).forEach(trait => {

                    score +=
                        traitScores[trait] *
                        intelligence.traits[trait];
                });

                intelligenceScores[key] =
                    Math.round(
                        score * 10
                    );
            });

        const ranking =
            Object.keys(
                intelligenceScores
            )
            .map(key => ({
                key,
                name:
                    INTELLIGENCES[key].name,
                score:
                    intelligenceScores[key]
            }))
            .sort(
                (a, b) =>
                    b.score - a.score
            );

        const learningStyle =
            determineLearningStyle(
                intelligenceScores
            );

        return {
            traits: traitScores,
            intelligences:
                intelligenceScores,
            ranking,
            top3:
                ranking.slice(0, 3),
            learningStyle,
            fingerDetails
        };
    }


    // --------------------------------------
    // 5. 학습스타일
    // --------------------------------------

    function determineLearningStyle(scores) {

        const styles = {

            language: scores.linguistic || 0,

            logic: scores.logical || 0,

            visual: scores.spatial || 0,

            body: scores.bodily || 0,

            social: scores.interpersonal || 0,

            reflection: scores.intrapersonal || 0

        };


        const sorted =
            Object.entries(styles)
                .sort(
                    (a, b) =>
                        b[1] - a[1]
                );


        const top =
            sorted[0][0];


        const descriptions = {

            language:
                "말하고 설명하고 글로 정리하면서 학습하는 언어 중심형",

            logic:
                "원리와 구조를 이해하고 문제를 해결하면서 학습하는 논리 중심형",

            visual:
                "이미지·도식·공간적 구조를 활용하여 이해하는 시각 중심형",

            body:
                "직접 해보고 움직이며 경험하는 체험 중심형",

            social:
                "대화·토론·협력 활동을 통해 배우는 관계 중심형",

            reflection:
                "혼자 생각하고 정리하며 자기 경험과 연결하는 성찰 중심형"

        };


        return {

            type: top,

            description:
                descriptions[top]

        };

    }


    // --------------------------------------
    // 외부 공개
    // --------------------------------------

    return {

        analyze: analyze,

        patterns: PATTERNS,

        fingers: FINGER_WEIGHTS,

        intelligences: INTELLIGENCES

    };

})();