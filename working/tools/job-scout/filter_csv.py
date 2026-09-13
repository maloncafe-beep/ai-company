"""
logs/案件検索結果.csv から除外キーワードに該当する行を削除して上書き保存し、
スプシ同期コマンドを案内する。

除外対象：マスターZの強み（提案書・営業資料・ライティング・AI活用）と無関係な案件
"""
import csv
import os
import re

# プロジェクトルート
_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CSV_PATH = os.path.join(_ROOT, "logs", "案件検索結果.csv")

# ===== 除外キーワード（タイトルに含まれていたら削除） =====
EXCLUDE_KEYWORDS = [
    # 動画・映像系
    "モデル",
    # SNS・デザイン系
    "SNS運用", "Instagram", "インスタ", "バナー", "デザイン", "Canva", "イラスト",
    "フィード投稿", "投稿制作", "サムネイル",
    # テレアポ・営業電話
    "テレアポ", "架電", "アポ獲得", "テレマーケ",
    # 単純作業・モニター系
    "アンケート", "モニター", "データ入力", "タイピング", "口コミ",
    # インタビュー・体験談（低単価）
    "インタビュー", "オンラインインタビュー", "ヒアリング", "体験談",
    # キャスト・出演系
    "キャスト", "モデル募集", "出演", "ライブ配信", "チャット",
    # 音声・ナレーション
    "ナレーション", "音声",
    # 写真
    "写真撮影", "プロフィール写真",
    # 家事・副業単純作業
    "家事の合間", "隙間時間", "1日1h",
    # 婚活・マッチング
    "婚活", "マッチングアプリ",
    # その他無関係
    "焚き火", "BBQ", "宿泊", "手話", "整体", "ヨガ", "エステ", "美容サロン",
]

# ===== 残すキーワード（除外対象でも強制的に残す） =====
# ※「営業資料」「提案書」を含む案件は除外キーワードに引っかかっても残す
KEEP_KEYWORDS = [
    "提案書", "営業資料", "資料作成", "パワーポイント", "PowerPoint",
    "AI活用", "業務効率化", "ライティング", "記事作成", "文書作成",
    "コピーライター", "ブログ",
]


def should_exclude(title: str) -> bool:
    # 残すキーワードが含まれていれば除外しない
    for kw in KEEP_KEYWORDS:
        if kw.lower() in title.lower():
            return False
    # 除外キーワードが含まれていれば除外
    for kw in EXCLUDE_KEYWORDS:
        if kw.lower() in title.lower():
            return True
    return False


def main():
    with open(CSV_PATH, "r", encoding="utf-8-sig") as f:
        reader = csv.reader(f)
        rows = list(reader)

    header = rows[0]
    data = rows[1:]

    kept = []
    removed = []

    for row in data:
        if not row:
            continue
        title = row[2] if len(row) > 2 else ""
        if should_exclude(title):
            removed.append(row)
        else:
            kept.append(row)

    print(f"元の件数: {len(data)} 件")
    print(f"除外件数: {len(removed)} 件")
    print(f"残す件数: {len(kept)} 件")
    print()
    print("=== 除外した案件（タイトル）===")
    for row in removed:
        print(f"  [{row[1]}] {row[2][:60]}")

    # 上書き保存
    with open(CSV_PATH, "w", encoding="utf-8-sig", newline="\n") as f:
        writer = csv.writer(f, lineterminator="\n")
        writer.writerow(header)
        writer.writerows(kept)

    print()
    print(f"✅ CSV を {len(kept)} 件に絞り込んで保存しました。")
    print("次のコマンドでスプシを更新してください：")
    print("  node server/scripts/sync-sheet.mjs --overwrite")


if __name__ == "__main__":
    main()
