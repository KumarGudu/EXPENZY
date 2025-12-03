# Quick Start Guide - ML Categorization System

## 🚀 Quick Setup (5 Steps)

### Step 1: Run Database Migration

```bash
cd /home/saswatranjanmohanty/Desktop/personal\ projects/EXPENZY/expense-tracker-server
npx prisma migrate dev --name add_ml_categorization
```

### Step 2: Setup Python Environment

```bash
cd ml-service
./setup.sh
```

### Step 3: Train the Model (~20 minutes)

```bash
source venv/bin/activate
python train.py
```

### Step 4: Upload to HuggingFace

```bash
# First time only: Login to HuggingFace
huggingface-cli login
# Paste your token from: https://huggingface.co/settings/tokens

# Upload the model
python upload_to_hf.py
```

### Step 5: Configure Environment

Edit `.env` file and add:

```env
HF_TOKEN=your_token_here
HF_MODEL_URL=https://api-inference.huggingface.co/models/YOUR_USERNAME/expense-category-model
OPENAI_API_KEY=your_openai_key_here  # Optional
```

## ✅ Test It Works

```bash
# Wait for server to restart, then test:
curl -X POST http://localhost:5000/api/categorization/detect \
  -H "Content-Type: application/json" \
  -d '{"description": "Paid rent for apartment"}'
```

Expected response:
```json
{
  "category": "housing",
  "confidence": 0.8,
  "source": "keyword"
}
```

## 📊 What You Get

- **14 Categories**: food, groceries, travel, shopping, medicine, bills, entertainment, housing, education, fitness, insurance, investment, pets, other
- **3-Tier System**: Keyword → ML Model → LLM Fallback
- **Smart Caching**: Reduces API calls, stays in free tier
- **150+ Keywords**: Fast categorization for common expenses

## 🔑 Get Your API Keys

1. **HuggingFace Token** (Required)
   - Go to: https://huggingface.co/settings/tokens
   - Click "New token"
   - Select "Write" permissions
   - Copy the token

2. **OpenAI API Key** (Optional but recommended)
   - Go to: https://platform.openai.com/api-keys
   - Create new key
   - Copy the key

## 📁 Files Created

```
expense-tracker-server/
├── ml-service/               # Python ML service
│   ├── train.py             # Training script
│   ├── test_model.py        # Testing script
│   ├── upload_to_hf.py      # Upload to HuggingFace
│   └── README.md            # Detailed guide
│
└── src/categorization/      # NestJS module
    ├── categorization.service.ts
    ├── keyword.service.ts
    ├── ml.service.ts
    ├── llm.service.ts
    └── cache.service.ts
```

## 🐛 Troubleshooting

**Migration fails?**
- Make sure PostgreSQL is running
- Check DATABASE_URL in .env

**Python not found?**
- Install Python 3.8+: `sudo apt install python3 python3-venv python3-pip`

**HuggingFace 503 error?**
- Model is loading (first time)
- Wait 5-10 minutes
- System will use LLM fallback automatically

**Training takes too long?**
- Normal: 15-30 minutes depending on hardware
- Uses CPU by default (GPU optional)

## 📖 Full Documentation

- **Detailed Guide**: `ml-service/README.md`
- **Implementation Plan**: See artifacts
- **Walkthrough**: Complete implementation details

## 💡 Tips

1. **Start with keywords**: Most common expenses are caught by keyword matching
2. **Cache is your friend**: Results are cached automatically
3. **Monitor usage**: Check cache stats at `/api/categorization/cache/stats`
4. **Free tier friendly**: HuggingFace gives ~100 requests/hour free

## 🎯 Next Actions

After setup, you can:
- Integrate with expense creation flow
- Add auto-categorization to existing expenses
- Build UI for category suggestions
- Add user feedback loop for improving accuracy

---

**Need help?** Check the full README at `ml-service/README.md`
