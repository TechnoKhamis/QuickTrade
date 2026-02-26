-- Create budget_goals table
CREATE TABLE IF NOT EXISTS budget_goals (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    month DATE NOT NULL,
    limit_amount DECIMAL(12, 3) NOT NULL CHECK (limit_amount > 0),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, category_id, month)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_budget_goals_user_month ON budget_goals(user_id, month);
CREATE INDEX IF NOT EXISTS idx_budget_goals_user_category ON budget_goals(user_id, category_id);
