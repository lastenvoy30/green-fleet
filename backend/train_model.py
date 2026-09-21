import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_percentage_error, mean_squared_error
import joblib

def load_data(path="../data/synthetic_voyages.csv"):
    df = pd.read_csv(path)
    return df

def prepare_features(df):
    # one-hot encode fuel_type since it's categorical
    df_encoded = pd.get_dummies(df, columns=["fuel_type"])
    X = df_encoded.drop(columns=["fuel_consumed_tons"])
    y = df_encoded["fuel_consumed_tons"]
    return X, y

def train_and_evaluate():
    df = load_data()
    X, y = prepare_features(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = GradientBoostingRegressor(random_state=42)
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mape = mean_absolute_percentage_error(y_test, predictions)
    rmse = mean_squared_error(y_test, predictions) ** 0.5

    print(f"MAPE: {mape:.4f} ({mape*100:.2f}%)")
    print(f"RMSE: {rmse:.4f}")

    # save model AND the column structure (needed later to match
    # input shape when predicting on new data)
    joblib.dump(model, "fuel_model.pkl")
    joblib.dump(list(X.columns), "model_columns.pkl")

    print("Model saved to fuel_model.pkl")

if __name__ == "__main__":
    train_and_evaluate()