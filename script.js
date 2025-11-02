const SAMPLE_TEXTS = {
            easy: [
                "The quick brown fox jumps over the lazy dog near the peaceful river.",
                "A gentle breeze flows through the tall trees in the quiet forest.",
                "Children play happily in the park under the bright summer sun.",
                "The cat sleeps on the warm windowsill in the afternoon light.",
                "Birds sing their sweet songs in the early morning hours.",
                "Flowers bloom beautifully in the garden during spring season.",
                "The moon shines brightly in the clear night sky above.",
            ],
            medium: [
                "Technology has revolutionized the way we communicate and interact with each other in modern society.",
                "The intricate patterns of nature reveal themselves to those who take time to observe carefully.",
                "Success is not final, failure is not fatal, it is the courage to continue that counts.",
                "Innovation distinguishes between a leader and a follower in competitive markets.",
                "Understanding complex problems requires patience, dedication, and analytical thinking.",
                "Effective communication involves active listening and clear articulation of thoughts.",
                "The journey of a thousand miles begins with a single step forward.",
            ],
            hard: [
                "Pseudopseudohypoparathyroidism exemplifies the complexity of medical terminology in endocrinology.",
                "The juxtaposition of anachronistic elements creates a paradoxical narrative framework.",
                "Entrepreneurial endeavors require meticulous planning, unwavering dedication, and strategic execution.",
                "Phosphorylation mechanisms facilitate cellular respiration through biochemical processes.",
                "Quantum entanglement demonstrates counterintuitive phenomena in theoretical physics.",
                "Epistemological considerations necessitate phenomenological investigations into consciousness.",
                "Chronological inconsistencies permeate historiographical interpretations of sociopolitical movements.",
            ],
            code: [
                "function calculateSum(a, b) { return a + b; }",
                "const array = [1, 2, 3].map(x => x * 2);",
                "if (condition === true) { console.log('Hello World'); }",
                "class MyClass { constructor() { this.value = 0; } }",
                "async function fetchData() { const response = await fetch(url); }",
                "for (let i = 0; i < array.length; i++) { console.log(array[i]); }",
                "const promise = new Promise((resolve, reject) => { resolve('Done'); });",
            ],
            numbers: [
                "In 1969, Apollo 11 landed on the moon with 3 astronauts aboard.",
                "The speed of light is approximately 299,792,458 meters per second.",
                "Pi equals 3.14159265358979323846 to 20 decimal places.",
                "There are 525,600 minutes in a year and 31,536,000 seconds.",
                "The binary code 01001000 01101001 represents 'Hi' in ASCII.",
                "Password: Secure#2024$Pass@word!123 with special characters included.",
                "Phone: +1 (555) 123-4567 or email: user@example.com for contact.",
            ],
            quotes: [
                "The only way to do great work is to love what you do. - Steve Jobs",
                "Life is what happens when you're busy making other plans. - John Lennon",
                "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
                "It is during our darkest moments that we must focus to see the light. - Aristotle",
                "Believe you can and you're halfway there. - Theodore Roosevelt",
                "The only impossible journey is the one you never begin. - Tony Robbins",
                "Success is not how high you have climbed, but how you make a positive difference. - Roy T. Bennett",
            ]
        };

        let currentText = '';
        let isStarted = false;
        let timer = null;
        let soundEnabled = true;
        let practiceMode = false;
        let history = [];
        let currentStreak = 0;
        let bestStreak = 0;
        let challenge = null;
        let wpmHistory = [];
        let achievements = {
            speedDemon: false,
            perfectScore: false,
            onFire: false
        };

        const challenges = [
            { type: 'speed', target: 60, description: 'Reach 60 WPM' },
            { type: 'speed', target: 80, description: 'Reach 80 WPM' },
            { type: 'accuracy', target: 95, description: 'Achieve 95% accuracy' },
            { type: 'accuracy', target: 98, description: 'Achieve 98% accuracy' },
            { type: 'streak', target: 20, description: 'Type 20 characters correctly in a row' },
            { type: 'streak', target: 50, description: 'Type 50 characters correctly in a row' },
        ];

        function generateNewText() {
            const difficulty = document.getElementById('difficulty').value;
            const texts = SAMPLE_TEXTS[difficulty];
            currentText = texts[Math.floor(Math.random() * texts.length)];
            displayText();
        }

        function displayText() {
            const display = document.getElementById('textDisplay');
            const input = document.getElementById('inputArea').value;
            let html = '';
            
            for (let i = 0; i < currentText.length; i++) {
                let className = 'char-pending';
                if (i < input.length) {
                    className = input[i] === currentText[i] ? 'char-correct' : 'char-incorrect';
                } else if (i === input.length) {
                    className = 'char-current';
                }
                html += `<span class="${className}">${currentText[i]}</span>`;
            }
            
            display.innerHTML = html;
        }

        function playSound(type) {
            if (!soundEnabled) return;
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                if (type === 'correct') {
                    oscillator.frequency.value = 800;
                    gainNode.gain.value = 0.08;
                } else {
                    oscillator.frequency.value = 200;
                    gainNode.gain.value = 0.12;
                }
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.04);
            } catch (e) {
                console.log('Audio not supported');
            }
        }

        function startTest() {
            isStarted = true;
            const duration = parseInt(document.getElementById('duration').value);
            document.getElementById('timeLeft').textContent = duration;
            document.getElementById('inputArea').disabled = false;
            document.getElementById('inputArea').value = '';
            document.getElementById('inputArea').focus();
            document.getElementById('startBtn').classList.add('hidden');
            document.getElementById('endBtn').classList.remove('hidden');
            document.getElementById('resultsPanel').classList.add('hidden');
            
            // Reset stats
            document.getElementById('wpm').textContent = '0';
            document.getElementById('accuracy').textContent = '100';
            document.getElementById('errors').textContent = '0';
            document.getElementById('keystrokes').textContent = '0';
            document.getElementById('streak').textContent = '0';
            document.getElementById('charsTyped').textContent = '0';
            document.getElementById('wordsTyped').textContent = '0';
            currentStreak = 0;
            wpmHistory = [];
            
            generateNewText();
            
            if (!practiceMode) {
                challenge = challenges[Math.floor(Math.random() * challenges.length)];
                document.getElementById('challengeBanner').classList.remove('hidden');
                document.getElementById('challengeText').textContent = `🎯 Challenge: ${challenge.description}`;
            }
            
            let timeLeft = duration;
            timer = setInterval(() => {
                timeLeft--;
                document.getElementById('timeLeft').textContent = timeLeft;
                
                // Record WPM for chart
                const currentWpm = parseInt(document.getElementById('wpm').textContent);
                wpmHistory.push({ time: duration - timeLeft, wpm: currentWpm });
                
                if (timeLeft <= 0) {
                    endTest();
                }
            }, 1000);
        }

        function endTest() {
            isStarted = false;
            clearInterval(timer);
            document.getElementById('inputArea').disabled = true;
            document.getElementById('startBtn').classList.remove('hidden');
            document.getElementById('endBtn').classList.add('hidden');
            
            const wpm = parseInt(document.getElementById('wpm').textContent);
            const accuracy = parseInt(document.getElementById('accuracy').textContent);
            
            checkAchievements(wpm, accuracy, currentStreak);
            showResults(wpm, accuracy);
            saveToHistory();
            createConfetti();
        }

        function resetTest() {
            isStarted = false;
            clearInterval(timer);
            const duration = parseInt(document.getElementById('duration').value);
            document.getElementById('timeLeft').textContent = duration;
            document.getElementById('inputArea').value = '';
            document.getElementById('inputArea').disabled = true;
            document.getElementById('startBtn').classList.remove('hidden');
            document.getElementById('endBtn').classList.add('hidden');
            document.getElementById('resultsPanel').classList.add('hidden');
            document.getElementById('challengeBanner').classList.add('hidden');
            
            document.getElementById('wpm').textContent = '0';
            document.getElementById('accuracy').textContent = '100';
            document.getElementById('errors').textContent = '0';
            document.getElementById('keystrokes').textContent = '0';
            document.getElementById('streak').textContent = '0';
            document.getElementById('charsTyped').textContent = '0';
            document.getElementById('wordsTyped').textContent = '0';
            currentStreak = 0;
            wpmHistory = [];
            
            updateProgressBars(0, 100, 0);
            generateNewText();
        }

        function checkAchievements(wpm, accuracy, streak) {
            const earned = [];
            
            if (wpm >= 80 && !achievements.speedDemon) {
                achievements.speedDemon = true;
                earned.push('🏃 Speed Demon');
            }
            
            if (accuracy === 100 && !achievements.perfectScore) {
                achievements.perfectScore = true;
                earned.push('🎯 Perfect Score');
            }
            
            if (streak >= 50 && !achievements.onFire) {
                achievements.onFire = true;
                earned.push('🔥 On Fire');
            }
            
            return earned;
        }

        function showResults(wpm, accuracy) {
            const resultsPanel = document.getElementById('resultsPanel');
            resultsPanel.classList.remove('hidden');
            
            let badge = '🏆';
            let level = 'Expert';
            let gradeColor = '#3b82f6';
            
            if (wpm >= 100) {
                badge = '👑'; level = 'Master'; gradeColor = '#8b5cf6';
            } else if (wpm >= 80) {
                badge = '🏆'; level = 'Expert'; gradeColor = '#3b82f6';
            } else if (wpm >= 60) {
                badge = '⭐'; level = 'Advanced'; gradeColor = '#10b981';
            } else if (wpm >= 40) {
                badge = '👍'; level = 'Intermediate'; gradeColor = '#fbbf24';
            } else if (wpm >= 20) {
                badge = '📝'; level = 'Beginner'; gradeColor = '#f59e0b';
            } else {
                badge = '🔰'; level = 'Novice'; gradeColor = '#94a3b8';
            }
            
            document.getElementById('performanceBadge').textContent = badge;
            document.getElementById('performanceLevel').textContent = level;
            document.getElementById('performanceLevel').style.color = gradeColor;
            document.getElementById('performanceText').textContent = 
                `You typed at ${wpm} WPM with ${accuracy}% accuracy! Best streak: ${bestStreak}`;
            
            // Show earned achievements
            const earnedBadges = checkAchievements(wpm, accuracy, currentStreak);
            const badgesContainer = document.getElementById('earnedBadges');
            badgesContainer.innerHTML = earnedBadges.map(badge => 
                `<div class="achievement">${badge}</div>`
            ).join('');
            
            // Create WPM chart
            createWpmChart();
        }

        function createWpmChart() {
            const chart = document.getElementById('wpmChart');
            const maxWpm = Math.max(...wpmHistory.map(h => h.wpm), 1);
            
            chart.innerHTML = wpmHistory.map(point => {
                const height = (point.wpm / maxWpm) * 100;
                return `
                    <div class="chart-bar" style="height: ${height}%">
                        <div class="tooltip">${point.time}s: ${point.wpm} WPM</div>
                    </div>
                `;
            }).join('');
        }

        function saveToHistory() {
            const result = {
                date: new Date().toLocaleString(),
                wpm: parseInt(document.getElementById('wpm').textContent),
                accuracy: parseInt(document.getElementById('accuracy').textContent),
                difficulty: document.getElementById('difficulty').value,
                duration: document.getElementById('duration').value,
                streak: bestStreak,
                errors: parseInt(document.getElementById('errors').textContent),
                grade: getGrade(parseInt(document.getElementById('wpm').textContent))
            };
            
            history.unshift(result);
            if (history.length > 20) history.pop();
            
            updateHistoryTable();
            updateLeaderboard();
        }

        function getGrade(wpm) {
            if (wpm >= 100) return 'S';
            if (wpm >= 80) return 'A';
            if (wpm >= 60) return 'B';
            if (wpm >= 40) return 'C';
            if (wpm >= 20) return 'D';
            return 'F';
        }

        function updateHistoryTable() {
            const tbody = document.getElementById('historyBody');
            
            if (history.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 30px;">No tests completed yet. Start typing to see your results here!</td></tr>';
                return;
            }
            
            tbody.innerHTML = history.map(result => `
                <tr>
                    <td>${result.date}</td>
                    <td><strong style="color: #3b82f6;">${result.wpm}</strong></td>
                    <td>${result.accuracy}%</td>
                    <td><span class="badge badge-${result.difficulty}">${result.difficulty}</span></td>
                    <td>🔥 ${result.streak}</td>
                    <td>${result.duration}s</td>
                    <td><strong style="font-size: 1.2em; color: #8b5cf6;">${result.grade}</strong></td>
                </tr>
            `).join('');
            
            // Update average WPM
            const avgWpm = Math.round(history.reduce((sum, r) => sum + r.wpm, 0) / history.length);
            document.getElementById('avgWpm').textContent = avgWpm;
        }

        function updateProgressBars(wpm, accuracy, consistency) {
            const speedPercent = Math.min((wpm / 100) * 100, 100);
            const accuracyPercent = accuracy;
            const consistencyPercent = consistency;
            
            document.getElementById('speedProgress').style.width = speedPercent + '%';
            document.getElementById('speedPercent').textContent = Math.round(speedPercent) + '%';
            
            document.getElementById('accuracyProgress').style.width = accuracyPercent + '%';
            document.getElementById('accuracyPercent').textContent = accuracyPercent + '%';
            
            document.getElementById('consistencyProgress').style.width = consistencyPercent + '%';
            document.getElementById('consistencyPercent').textContent = Math.round(consistencyPercent) + '%';
        }

        function toggleSound() {
            soundEnabled = !soundEnabled;
            const btns = document.querySelectorAll('.tab-btn');
            btns[0].classList.toggle('active');
            btns[0].textContent = soundEnabled ? '🔊 Sound' : '🔇 Sound';
        }

        function togglePracticeMode() {
            practiceMode = !practiceMode;
            const btns = document.querySelectorAll('.tab-btn');
            btns[1].classList.toggle('active');
            btns[1].textContent = practiceMode ? '🎯 Practice' : '🎯 Challenge';
            
            if (practiceMode) {
                document.getElementById('challengeBanner').classList.add('hidden');
            }
        }

        function showLeaderboard() {
            const modal = document.getElementById('leaderboardModal');
            modal.classList.remove('hidden');
            
            const sorted = [...history].sort((a, b) => b.wpm - a.wpm).slice(0, 10);
            const content = document.getElementById('leaderboardContent');
            
            if (sorted.length === 0) {
                content.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 30px;">No records yet. Complete some tests first!</p>';
                return;
            }
            
            content.innerHTML = sorted.map((entry, index) => {
                const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : '';
                return `
                    <div class="leaderboard-entry">
                        <div class="leaderboard-rank ${rankClass}">${index + 1}</div>
                        <div style="flex: 1;">
                            <strong>${entry.wpm} WPM</strong>
                            <div style="font-size: 0.85em; color: #64748b;">
                                ${entry.accuracy}% accuracy • ${entry.date}
                            </div>
                        </div>
                        <span class="badge badge-${entry.difficulty}">${entry.difficulty}</span>
                    </div>
                `;
            }).join('');
        }

        function showStats() {
            const modal = document.getElementById('statsModal');
            modal.classList.remove('hidden');
            
            const content = document.getElementById('statsContent');
            
            if (history.length === 0) {
                content.innerHTML = '<p style="text-align: center; color: #94a3b8; padding: 30px;">No data available yet!</p>';
                return;
            }
            
            const totalTests = history.length;
            const avgWpm = Math.round(history.reduce((sum, r) => sum + r.wpm, 0) / totalTests);
            const avgAccuracy = Math.round(history.reduce((sum, r) => sum + r.accuracy, 0) / totalTests);
            const bestWpm = Math.max(...history.map(r => r.wpm));
            const totalWords = history.reduce((sum, r) => sum + Math.round(r.wpm * r.duration / 60), 0);
            
            content.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
                    <div style="padding: 20px; background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 12px; text-align: center;">
                        <div style="font-size: 2.5em; font-weight: 900; color: #3b82f6;">${totalTests}</div>
                        <div style="color: #64748b; font-weight: 600;">Total Tests</div>
                    </div>
                    <div style="padding: 20px; background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 12px; text-align: center;">
                        <div style="font-size: 2.5em; font-weight: 900; color: #8b5cf6;">${avgWpm}</div>
                        <div style="color: #64748b; font-weight: 600;">Avg WPM</div>
                    </div>
                    <div style="padding: 20px; background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 12px; text-align: center;">
                        <div style="font-size: 2.5em; font-weight: 900; color: #10b981;">${avgAccuracy}%</div>
                        <div style="color: #64748b; font-weight: 600;">Avg Accuracy</div>
                    </div>
                    <div style="padding: 20px; background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 12px; text-align: center;">
                        <div style="font-size: 2.5em; font-weight: 900; color: #ec4899;">${bestWpm}</div>
                        <div style="color: #64748b; font-weight: 600;">Best WPM</div>
                    </div>
                </div>
                <div style="padding: 20px; background: linear-gradient(135deg, #fef3c7, #fde68a); border-radius: 12px; text-align: center;">
                    <div style="font-size: 2em; margin-bottom: 10px;">🎉</div>
                    <strong style="color: #92400e;">You've typed ${totalWords.toLocaleString()} words total!</strong>
                </div>
            `;
        }

        function closeModal(modalId) {
            document.getElementById(modalId).classList.add('hidden');
        }

        function updateLeaderboard() {
            // Update achievements display
            const list = document.getElementById('achievementsList');
            list.innerHTML = `
                <div style="padding: 12px; background: ${achievements.speedDemon ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : '#f8fafc'}; border-radius: 10px; opacity: ${achievements.speedDemon ? '1' : '0.5'};">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 2em;">🏃</span>
                        <div>
                            <strong>Speed Demon</strong>
                            <p style="font-size: 0.85em; color: #64748b; margin: 0;">Reach 80+ WPM</p>
                        </div>
                    </div>
                </div>
                <div style="padding: 12px; background: ${achievements.perfectScore ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : '#f8fafc'}; border-radius: 10px; opacity: ${achievements.perfectScore ? '1' : '0.5'};">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 2em;">🎯</span>
                        <div>
                            <strong>Perfect Score</strong>
                            <p style="font-size: 0.85em; color: #64748b; margin: 0;">100% accuracy</p>
                        </div>
                    </div>
                </div>
                <div style="padding: 12px; background: ${achievements.onFire ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : '#f8fafc'}; border-radius: 10px; opacity: ${achievements.onFire ? '1' : '0.5'};">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 2em;">🔥</span>
                        <div>
                            <strong>On Fire</strong>
                            <p style="font-size: 0.85em; color: #64748b; margin: 0;">50+ streak</p>
                        </div>
                    </div>
                </div>
            `;
        }

        function exportResults() {
            if (history.length === 0) {
                alert('No results to export yet! Complete some tests first.');
                return;
            }
            
            let data = '═══════════════════════════════════════════\n';
            data += '   ELITE TYPING SPEED TESTER - RESULTS\n';
            data += '═══════════════════════════════════════════\n\n';
            
            const avgWpm = Math.round(history.reduce((sum, r) => sum + r.wpm, 0) / history.length);
            const avgAccuracy = Math.round(history.reduce((sum, r) => sum + r.accuracy, 0) / history.length);
            const bestWpm = Math.max(...history.map(r => r.wpm));
            
            data += 'SUMMARY STATISTICS:\n';
            data += `  Total Tests: ${history.length}\n`;
            data += `  Average WPM: ${avgWpm}\n`;
            data += `  Average Accuracy: ${avgAccuracy}%\n`;
            data += `  Best WPM: ${bestWpm}\n`;
            data += `  Best Streak: ${Math.max(...history.map(r => r.streak))}\n\n`;
            
            data += 'DETAILED HISTORY:\n';
            data += '─────────────────────────────────────────────\n';
            history.forEach((result, index) => {
                data += `${index + 1}. ${result.date}\n`;
                data += `   WPM: ${result.wpm} | Accuracy: ${result.accuracy}%\n`;
                data += `   Type: ${result.difficulty} | Duration: ${result.duration}s\n`;
                data += `   Streak: ${result.streak} | Grade: ${result.grade}\n`;
                data += '─────────────────────────────────────────────\n';
            });
            
            data += '\nACHIEVEMENTS UNLOCKED:\n';
            if (achievements.speedDemon) data += '  ✓ 🏃 Speed Demon (80+ WPM)\n';
            if (achievements.perfectScore) data += '  ✓ 🎯 Perfect Score (100% accuracy)\n';
            if (achievements.onFire) data += '  ✓ 🔥 On Fire (50+ streak)\n';
            
            data += '\n═══════════════════════════════════════════\n';
            data += 'Generated by Elite Typing Speed Tester Pro\n';
            data += new Date().toLocaleString() + '\n';
            data += '═══════════════════════════════════════════\n';
            
            const blob = new Blob([data], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `typing-results-${Date.now()}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        }

        function createConfetti() {
            const colors = ['#fbbf24', '#3b82f6', '#ec4899', '#8b5cf6', '#10b981'];
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * window.innerWidth + 'px';
                    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                    document.body.appendChild(confetti);
                    
                    setTimeout(() => confetti.remove(), 3000);
                }, i * 30);
            }
        }

        document.getElementById('inputArea').addEventListener('input', function(e) {
            if (!isStarted) return;
            
            const input = e.target.value;
            const keystrokes = parseInt(document.getElementById('keystrokes').textContent);
            document.getElementById('keystrokes').textContent = keystrokes + 1;
            
            // Update character and word count
            document.getElementById('charsTyped').textContent = input.length;
            document.getElementById('wordsTyped').textContent = input.trim().split(/\s+/).filter(w => w.length > 0).length;
            
            // Calculate stats
            let errors = 0;
            let correct = 0;
            for (let i = 0; i < input.length; i++) {
                if (input[i] !== currentText[i]) {
                    errors++;
                } else {
                    correct++;
                }
            }
            
            // Update streak
            if (input.length > 0) {
                const lastChar = input[input.length - 1];
                const expectedChar = currentText[input.length - 1];
                
                if (lastChar === expectedChar) {
                    currentStreak++;
                    if (currentStreak > bestStreak) {
                        bestStreak = currentStreak;
                        document.getElementById('bestStreak').textContent = bestStreak;
                    }
                    playSound('correct');
                } else {
                    currentStreak = 0;
                    playSound('error');
                }
            }
            
            document.getElementById('errors').textContent = errors;
            document.getElementById('streak').textContent = currentStreak;
            
            const accuracy = input.length > 0 ? Math.round((correct / input.length) * 100) : 100;
            document.getElementById('accuracy').textContent = accuracy;
            
            // Calculate WPM
            const duration = parseInt(document.getElementById('duration').value);
            const timeLeft = parseInt(document.getElementById('timeLeft').textContent);
            const timeElapsed = (duration - timeLeft) / 60;
            
            let wpm = 0;
            if (timeElapsed > 0) {
                const words = input.trim().split(/\s+/).filter(w => w.length > 0).length;
                wpm = Math.round(words / timeElapsed);
                document.getElementById('wpm').textContent = wpm;
            }
            
            // Calculate consistency (based on error rate variation)
            const errorRate = input.length > 0 ? (errors / input.length) : 0;
            const consistency = Math.max(0, 100 - (errorRate * 100));
            
            // Update progress bars
            updateProgressBars(wpm, accuracy, consistency);
            
            displayText();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (!isStarted) {
                        startTest();
                    } else {
                        endTest();
                    }
                } else if (e.key === 'r') {
                    e.preventDefault();
                    resetTest();
                }
            }
        });

        // Initialize
        generateNewText();
        updateLeaderboard();

        // Add typing mode effects
        document.getElementById('typingMode').addEventListener('change', function() {
            const mode = this.value;
            const textDisplay = document.querySelector('.text-display');
            
            if (mode === 'zen') {
                textDisplay.style.filter = 'blur(3px)';
                setTimeout(() => {
                    textDisplay.style.filter = 'none';
                }, 100);
            } else if (mode === 'rush') {
                textDisplay.style.animation = 'pulse 0.5s ease';
            } else {
                textDisplay.style.filter = 'none';
                textDisplay.style.animation = 'none';
            }
        });

        // Motivational messages
        const motivationalMessages = [
            "🚀 You're doing great! Keep it up!",
            "💪 Every keystroke counts!",
            "⭐ Practice makes perfect!",
            "🎯 Stay focused and type on!",
            "🔥 You're on fire today!",
        ];

        setInterval(() => {
            if (isStarted && Math.random() > 0.7) {
                const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    color: white;
                    padding: 15px 25px;
                    border-radius: 12px;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                    z-index: 1000;
                    animation: slideIn 0.3s ease;
                    font-weight: 600;
                `;
                notification.textContent = message;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.style.animation = 'slideOut 0.3s ease';
                    setTimeout(() => notification.remove(), 300);
                }, 2000);
            }
        }, 10000);

        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }
        `;
        document.head.appendChild(style);

        // Display welcome message on first visit
        if (!localStorage.getItem('visitedBefore')) {
            localStorage.setItem('visitedBefore', 'true');
            setTimeout(() => {
                const welcome = document.createElement('div');
                welcome.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    z-index: 1000;
                    text-align: center;
                    max-width: 500px;
                    animation: scaleIn 0.5s ease;
                `;
                welcome.innerHTML = `
                    <div style="font-size: 4em; margin-bottom: 20px;">👋</div>
                    <h2 style="margin-bottom: 15px; color: #1e293b;">Welcome to Elite Typing Speed Tester!</h2>
                    <p style="color: #64748b; margin-bottom: 20px;">
                        Master your typing skills with advanced features, real-time analytics, and gamification.
                    </p>
                    <button onclick="this.parentElement.remove()" class="btn btn-primary">
                        Let's Start! 🚀
                    </button>
                `;
                document.body.appendChild(welcome);
            }, 1000);
        }

        // Auto-save history to localStorage
        function saveToLocalStorage() {
            try {
                localStorage.setItem('typingHistory', JSON.stringify(history));
                localStorage.setItem('typingAchievements', JSON.stringify(achievements));
            } catch (e) {
                console.log('LocalStorage not available');
            }
        }

        function loadFromLocalStorage() {
            try {
                const savedHistory = localStorage.getItem('typingHistory');
                const savedAchievements = localStorage.getItem('typingAchievements');
                
                if (savedHistory) {
                    history = JSON.parse(savedHistory);
                    updateHistoryTable();
                }
                
                if (savedAchievements) {
                    achievements = JSON.parse(savedAchievements);
                    updateLeaderboard();
                }
            } catch (e) {
                console.log('Could not load from localStorage');
            }
        }

        // Load saved data on startup
        loadFromLocalStorage();

        // Save automatically when history updates
        const originalSaveToHistory = saveToHistory;
        saveToHistory = function() {
            originalSaveToHistory();
            saveToLocalStorage();
        };

        console.log('%c⚡ Elite Typing Speed Tester Pro', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
        console.log('%cKeyboard Shortcuts:', 'font-weight: bold; margin-top: 10px;');
        console.log('Ctrl/Cmd + Enter: Start/End Test');
        console.log('Ctrl/Cmd + R: Reset Test');
        console.log('%c\nHappy Typing! 🚀', 'color: #10b981; font-weight: bold;');