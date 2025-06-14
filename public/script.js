var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('surveyForm');
    var thankYouDiv = document.getElementById('thankYou');
    var starRatings = document.querySelectorAll('.star-rating');
    var ratings = {};
    // Initialize star rating functionality
    starRatings.forEach(function (ratingContainer) {
        var stars = ratingContainer.querySelectorAll('.star');
        var ratingType = ratingContainer.getAttribute('data-rating') || '';
        stars.forEach(function (star, index) {
            star.addEventListener('click', function () {
                var value = index + 1;
                ratings[ratingType] = value;
                // Update visual state
                stars.forEach(function (s, i) {
                    if (i < value) {
                        s.classList.add('active');
                    }
                    else {
                        s.classList.remove('active');
                    }
                });
            });
            // Hover effect
            star.addEventListener('mouseenter', function () {
                stars.forEach(function (s, i) {
                    if (i <= index) {
                        s.style.color = '#ffd700';
                    }
                    else {
                        s.style.color = '#ddd';
                    }
                });
            });
        });
        // Reset hover effect
        ratingContainer.addEventListener('mouseleave', function () {
            stars.forEach(function (s, i) {
                if (s.classList.contains('active')) {
                    s.style.color = '#ffd700';
                }
                else {
                    s.style.color = '#ddd';
                }
            });
        });
    });
    // Form submission
    form.addEventListener('submit', function (e) { return __awaiter(_this, void 0, void 0, function () {
        var requiredRatings, missingRatings, formData, surveyData, response, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    requiredRatings = ['overall', 'food', 'decor', 'entertainment'];
                    missingRatings = requiredRatings.filter(function (rating) { return !ratings[rating]; });
                    if (missingRatings.length > 0) {
                        alert("Please rate: ".concat(missingRatings.join(', ')));
                        return [2 /*return*/];
                    }
                    formData = new FormData(form);
                    surveyData = {
                        name: formData.get('name'),
                        phone: formData.get('phone'),
                        email: formData.get('email'),
                        referralSource: formData.get('referralSource'),
                        overall_rating: ratings.overall,
                        overall_comments: formData.get('overall_comments'),
                        food_rating: ratings.food,
                        food_comments: formData.get('food_comments'),
                        decor_rating: ratings.decor,
                        decor_comments: formData.get('decor_comments'),
                        entertainment_rating: ratings.entertainment,
                        entertainment_comments: formData.get('entertainment_comments'),
                        timestamp: new Date().toISOString()
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('/api/submit-survey', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(surveyData)
                        })];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    if (response.ok && result.success) {
                        // Show thank you message
                        form.style.display = 'none';
                        thankYouDiv.classList.remove('hidden');
                        // Scroll to top
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                    else {
                        if (result.error === 'duplicate') {
                            alert('You have already submitted a survey with this email address.');
                        }
                        else {
                            alert('There was an error submitting your survey. Please try again.');
                        }
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('Error:', error_1);
                    alert('There was an error submitting your survey. Please try again.');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
});
