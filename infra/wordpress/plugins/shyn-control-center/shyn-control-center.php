<?php
/**
 * Plugin Name: Shyn Control Center
 * Description: Internal control center for Shyn Legal operations.
 * Version: 0.1.0
 */

if (!defined('ABSPATH')) {
    exit;
}

function shyn_control_get_settings() {
    $defaults = [
        'api_base_url' => 'http://localhost:4000',
        'admin_api_key' => '',
    ];

    $saved = get_option('shyn_control_settings', []);
    if (!is_array($saved)) {
        $saved = [];
    }

    return wp_parse_args($saved, $defaults);
}

function shyn_control_render_styles() {
    static $rendered = false;

    if ($rendered) {
        return;
    }

    $rendered = true;

    echo '<style>
        .shyn-control-shell {
            --shyn-bg: #f6f1e8;
            --shyn-card: #ffffff;
            --shyn-ink: #132238;
            --shyn-muted: #5f6b7a;
            --shyn-accent: #b06a2b;
            --shyn-accent-soft: rgba(176, 106, 43, 0.12);
            --shyn-line: rgba(19, 34, 56, 0.1);
            color: var(--shyn-ink);
        }

        .shyn-control-shell .shyn-control-hero {
            background: linear-gradient(135deg, #132238 0%, #1f3857 48%, #b06a2b 100%);
            color: #fff;
            border-radius: 22px;
            padding: 28px;
            box-shadow: 0 18px 50px rgba(19, 34, 56, 0.18);
            margin: 20px 0 18px;
        }

        .shyn-control-shell .shyn-control-kicker {
            margin: 0 0 8px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            font-size: 11px;
            opacity: 0.82;
        }

        .shyn-control-shell .shyn-control-title {
            margin: 0;
            font-size: 34px;
            line-height: 1.05;
        }

        .shyn-control-shell .shyn-control-subtitle {
            margin: 12px 0 0;
            max-width: 760px;
            font-size: 15px;
            line-height: 1.7;
            opacity: 0.95;
        }

        .shyn-control-shell .shyn-control-grid {
            display: grid;
            gap: 14px;
        }

        .shyn-control-shell .shyn-control-grid.cards {
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        }

        .shyn-control-shell .shyn-control-grid.two-up {
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        }

        .shyn-control-shell .shyn-control-card,
        .shyn-control-shell .postbox.shyn-control-card {
            background: var(--shyn-card);
            border: 1px solid var(--shyn-line);
            border-radius: 18px;
            padding: 18px;
            box-shadow: 0 10px 25px rgba(19, 34, 56, 0.05);
        }

        .shyn-control-shell .shyn-control-card h2,
        .shyn-control-shell .shyn-control-card h3 {
            margin-top: 0;
        }

        .shyn-control-shell .shyn-control-card-value {
            font-size: 30px;
            font-weight: 700;
            margin: 8px 0 4px;
            line-height: 1;
        }

        .shyn-control-shell .shyn-control-card-label {
            color: var(--shyn-muted);
            font-size: 13px;
        }

        .shyn-control-shell .shyn-control-card-note {
            margin-top: 10px;
            color: var(--shyn-muted);
            font-size: 13px;
            line-height: 1.5;
        }

        .shyn-control-shell .shyn-control-section-title {
            margin: 0 0 10px;
            font-size: 18px;
        }

        .shyn-control-shell .shyn-control-section-note {
            margin: 0 0 14px;
            color: var(--shyn-muted);
            font-size: 14px;
            line-height: 1.6;
        }

        .shyn-control-shell .shyn-control-status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            border-radius: 999px;
            padding: 5px 10px;
            font-size: 12px;
            font-weight: 600;
        }

        .shyn-control-shell .shyn-control-status.ok {
            background: rgba(45, 132, 87, 0.12);
            color: #2d8457;
        }

        .shyn-control-shell .shyn-control-status.warn {
            background: rgba(197, 105, 0, 0.12);
            color: #a95f00;
        }

        .shyn-control-shell .shyn-control-status.alert {
            background: rgba(184, 46, 46, 0.12);
            color: #b82e2e;
        }

        .shyn-control-shell .shyn-control-list {
            display: grid;
            gap: 12px;
            margin: 0;
        }

        .shyn-control-shell .shyn-control-list-item {
            border: 1px solid var(--shyn-line);
            border-radius: 14px;
            padding: 14px;
            background: linear-gradient(180deg, #fff 0%, #fcfbf8 100%);
        }

        .shyn-control-shell .shyn-control-list-row {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            align-items: start;
            flex-wrap: wrap;
        }

        .shyn-control-shell .shyn-control-list-title {
            font-weight: 700;
            font-size: 15px;
            margin: 0 0 4px;
        }

        .shyn-control-shell .shyn-control-list-meta {
            color: var(--shyn-muted);
            font-size: 13px;
            line-height: 1.55;
        }

        .shyn-control-shell .shyn-control-pill {
            display: inline-flex;
            align-items: center;
            border-radius: 999px;
            padding: 4px 10px;
            background: var(--shyn-accent-soft);
            color: var(--shyn-accent);
            font-size: 12px;
            font-weight: 700;
        }

        .shyn-control-shell .shyn-control-link-row {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 14px;
        }

        .shyn-control-shell .shyn-control-link-row .button,
        .shyn-control-shell .shyn-control-link-row .button-primary {
            border-radius: 999px;
            padding-left: 14px;
            padding-right: 14px;
        }

        .shyn-control-shell .shyn-control-table-wrap {
            overflow-x: auto;
        }

        .shyn-control-shell .shyn-control-table-wrap table.widefat {
            border: 1px solid var(--shyn-line);
            border-radius: 14px;
            overflow: hidden;
        }

        .shyn-control-shell .shyn-control-small {
            font-size: 13px;
            color: var(--shyn-muted);
        }
    </style>';
}

function shyn_control_render_page_header($title, $subtitle, $buttons = []) {
    echo '<div class="shyn-control-hero">';
    echo '<p class="shyn-control-kicker">Shyn Legal control center</p>';
    echo '<h1 class="shyn-control-title">' . esc_html($title) . '</h1>';
    echo '<p class="shyn-control-subtitle">' . esc_html($subtitle) . '</p>';

    if (!empty($buttons)) {
        echo '<div class="shyn-control-link-row">';
        foreach ($buttons as $button) {
            $url = isset($button['url']) ? $button['url'] : '#';
            $label = isset($button['label']) ? $button['label'] : '';
            $class = isset($button['class']) ? $button['class'] : 'button';
            echo '<a class="' . esc_attr($class) . '" href="' . esc_url($url) . '">' . esc_html($label) . '</a>';
        }
        echo '</div>';
    }

    echo '</div>';
}

function shyn_control_status_badge($status) {
    $normalized = strtolower(trim((string) $status));
    $tone = 'warn';
    $label = $status;

    if ($normalized === 'completed' || $normalized === 'approved' || $normalized === 'connected' || $normalized === 'published' || $normalized === 'ok') {
        $tone = 'ok';
    } elseif ($normalized === 'failed' || $normalized === 'error' || $normalized === 'high') {
        $tone = 'alert';
    }

    return '<span class="shyn-control-status ' . esc_attr($tone) . '">' . esc_html($label) . '</span>';
}

function shyn_control_render_metric_cards($cards) {
    echo '<div class="shyn-control-grid cards" style="margin-top: 18px;">';
    foreach ($cards as $card) {
        echo '<div class="shyn-control-card">';
        echo '<div class="shyn-control-card-label">' . esc_html($card['label']) . '</div>';
        echo '<div class="shyn-control-card-value">' . esc_html((string) $card['value']) . '</div>';
        if (!empty($card['note'])) {
            echo '<div class="shyn-control-card-note">' . esc_html($card['note']) . '</div>';
        }
        echo '</div>';
    }
    echo '</div>';
}

function shyn_control_render_table($title, $rows) {
    echo '<div class="shyn-control-card" style="margin-top: 18px;">';
    echo '<h2 class="shyn-control-section-title">' . esc_html($title) . '</h2>';

    if (empty($rows) || !is_array($rows)) {
        echo '<p class="shyn-control-small">No data available yet.</p>';
        echo '</div>';
        return;
    }

    $headers = array_keys($rows[0]);

    echo '<div class="shyn-control-table-wrap">';
    echo '<table class="widefat striped shyn-control-table">';
    echo '<thead><tr>';
    foreach ($headers as $header) {
        echo '<th>' . esc_html($header) . '</th>';
    }
    echo '</tr></thead>';
    echo '<tbody>';

    foreach ($rows as $row) {
        echo '<tr>';
        foreach ($headers as $header) {
            $value = isset($row[$header]) ? $row[$header] : '';
            if (is_array($value)) {
                $value = wp_json_encode($value);
            }
            echo '<td>' . esc_html((string) $value) . '</td>';
        }
        echo '</tr>';
    }

    echo '</tbody></table>';
    echo '</div>';
    echo '</div>';
}

function shyn_control_format_time($value) {
    if (!$value) {
        return 'Just now';
    }

    $timestamp = strtotime((string) $value);
    if ($timestamp === false) {
        return (string) $value;
    }

    return wp_date('j M Y, H:i', $timestamp);
}

function shyn_control_format_rating($rating) {
    $rating = max(0, min(5, (int) $rating));
    return str_repeat('★', $rating) . str_repeat('☆', 5 - $rating);
}

function shyn_control_plain_status($value) {
    $map = [
        'lead_created' => 'New person added',
        'booking_created' => 'Booking created',
        'booking_rescheduled' => 'Booking moved',
        'booking_cancelled' => 'Booking cancelled',
        'review_sync' => 'Reviews synced',
        'ai_prompt_updated' => 'AI instructions updated',
    ];

    return $map[$value] ?? str_replace('_', ' ', (string) $value);
}

function shyn_control_call_api($path) {
    $settings = shyn_control_get_settings();
    $base_url = untrailingslashit($settings['api_base_url']);
    $url = $base_url . $path;

    $args = [
        'timeout' => 10,
        'headers' => [
            'x-admin-key' => $settings['admin_api_key'],
        ],
    ];

    $response = wp_remote_get($url, $args);

    if (is_wp_error($response)) {
        return $response;
    }

    $status = wp_remote_retrieve_response_code($response);
    $body = wp_remote_retrieve_body($response);
    $decoded = json_decode($body, true);

    if ($status >= 400) {
        return new WP_Error('shyn_api_error', 'API request failed', [
            'status' => $status,
            'body' => $decoded,
        ]);
    }

    return $decoded;
}

function shyn_control_post_api($path, $payload) {
    $settings = shyn_control_get_settings();
    $base_url = untrailingslashit($settings['api_base_url']);
    $url = $base_url . $path;

    $response = wp_remote_post($url, [
        'timeout' => 10,
        'headers' => [
            'Content-Type' => 'application/json',
            'x-admin-key' => $settings['admin_api_key'],
        ],
        'body' => wp_json_encode($payload),
    ]);

    if (is_wp_error($response)) {
        return $response;
    }

    $status = wp_remote_retrieve_response_code($response);
    $body = wp_remote_retrieve_body($response);
    $decoded = json_decode($body, true);

    if ($status >= 400) {
        return new WP_Error('shyn_api_error', 'API request failed', [
            'status' => $status,
            'body' => $decoded,
        ]);
    }

    return $decoded;
}

function shyn_control_render_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    shyn_control_render_styles();

    if (isset($_POST['shyn_control_settings_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['shyn_control_settings_nonce'])), 'shyn_control_save_settings')) {
        $settings = [
            'api_base_url' => isset($_POST['api_base_url']) ? esc_url_raw(wp_unslash($_POST['api_base_url'])) : '',
            'admin_api_key' => isset($_POST['admin_api_key']) ? sanitize_text_field(wp_unslash($_POST['admin_api_key'])) : '',
        ];
        update_option('shyn_control_settings', $settings);
        echo '<div class="notice notice-success is-dismissible"><p>Settings saved.</p></div>';
    }

    $settings = shyn_control_get_settings();
    $test_result = null;
    if (isset($_POST['shyn_test_connection_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['shyn_test_connection_nonce'])), 'shyn_test_connection')) {
        $test_result = shyn_control_call_api('/health');
    }
    ?>
    <div class="wrap shyn-control-shell">
        <?php shyn_control_render_page_header('Connection settings', 'Configure the Node.js backend address and private key. The Next.js frontend also reads these settings — keep them in sync with your .env file.', [
            ['label' => 'Back to dashboard', 'url' => admin_url('admin.php?page=shyn-control-center'), 'class' => 'button button-secondary'],
        ]); ?>

        <?php if ($test_result !== null): ?>
            <?php if (is_wp_error($test_result)): ?>
                <div class="notice notice-error"><p>Connection failed: <?php echo esc_html($test_result->get_error_message()); ?></p></div>
            <?php else: ?>
                <div class="notice notice-success is-dismissible"><p>Connected successfully. Backend status: <strong><?php echo esc_html(isset($test_result['status']) ? $test_result['status'] : 'ok'); ?></strong></p></div>
            <?php endif; ?>
        <?php endif; ?>

        <form method="post">
            <?php wp_nonce_field('shyn_control_save_settings', 'shyn_control_settings_nonce'); ?>
            <table class="form-table shyn-control-card">
                <tr>
                    <th scope="row"><label for="api_base_url">Node.js API address</label></th>
                    <td>
                        <input name="api_base_url" id="api_base_url" class="regular-text" value="<?php echo esc_attr($settings['api_base_url']); ?>" />
                        <p class="description">Default: <code>http://localhost:4000</code>. Must match <code>API_BASE_URL</code> in <code>apps/web/.env.local</code>.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="admin_api_key">Admin API key</label></th>
                    <td>
                        <input name="admin_api_key" id="admin_api_key" class="regular-text" value="<?php echo esc_attr($settings['admin_api_key']); ?>" />
                        <p class="description">Must match <code>ADMIN_API_KEY</code> in your root <code>.env</code> file.</p>
                    </td>
                </tr>
            </table>
            <?php submit_button('Save Settings'); ?>
        </form>

        <form method="post" style="margin-top: 10px;">
            <?php wp_nonce_field('shyn_test_connection', 'shyn_test_connection_nonce'); ?>
            <input type="submit" class="button button-secondary" value="Test connection to Node.js API" />
        </form>

        <div class="shyn-control-card" style="margin-top: 18px;">
            <h2 class="shyn-control-section-title">How the connection works</h2>
            <p class="shyn-control-small" style="line-height:1.7;">
                <strong>WordPress (localhost:8080)</strong> → calls Node.js API at the address above for admin data.<br>
                <strong>Next.js frontend (localhost:3000)</strong> → calls Node.js API directly at <code>API_BASE_URL</code>, then falls back through WordPress REST relay at <code>/wp-json/shyn/v1/</code> if the direct connection fails.<br>
                Keep <code>ADMIN_API_KEY</code> identical in your <code>.env</code> file and in this settings page.
            </p>
        </div>
    </div>
    <?php
}

function shyn_control_render_dashboard_page() {
    shyn_control_render_styles();

    echo '<div class="wrap shyn-control-shell">';
    shyn_control_render_page_header(
        'Shyn Control Center',
        'A plain view of what landed, what needs attention, and what changed recently.',
        [
            ['label' => 'Open settings', 'url' => admin_url('admin.php?page=shyn-control-settings'), 'class' => 'button button-primary'],
            ['label' => 'Check activity', 'url' => admin_url('admin.php?page=shyn-control-automation-logs'), 'class' => 'button button-secondary'],
        ],
    );

    $analytics = shyn_control_call_api('/api/admin/analytics');
    $recentLeads = shyn_control_call_api('/api/admin/leads?limit=5');
    $recentReviews = shyn_control_call_api('/api/admin/reviews?limit=5');
    $recentAutomation = shyn_control_call_api('/api/admin/automation-logs?limit=5');
    $localSettings = shyn_control_get_settings();
    $prompt = shyn_control_call_api('/api/admin/ai-prompt');

    if (is_wp_error($analytics)) {
        echo '<div class="shyn-control-card"><p>Could not load the dashboard. Check the backend address and private key in settings.</p></div>';
        echo '</div>';
        return;
    }

    shyn_control_render_metric_cards([
        [
            'label' => 'People who reached out',
            'value' => isset($analytics['totalLeads']) ? $analytics['totalLeads'] : 0,
            'note' => 'All new enquiries captured by the system.',
        ],
        [
            'label' => 'Bookings today',
            'value' => isset($analytics['bookingsToday']) ? $analytics['bookingsToday'] : 0,
            'note' => 'Meetings scheduled for today.',
        ],
        [
            'label' => 'Messages reviewed',
            'value' => isset($analytics['aiConversations']) ? $analytics['aiConversations'] : 0,
            'note' => 'AI-assisted case checks saved in the backend.',
        ],
        [
            'label' => 'Higher-risk cases',
            'value' => isset($analytics['highRiskCases']) ? $analytics['highRiskCases'] : 0,
            'note' => 'Items that need a closer look.',
        ],
        [
            'label' => 'From enquiry to booking',
            'value' => isset($analytics['conversionRate']) ? $analytics['conversionRate'] . '%' : '0%',
            'note' => 'Share of leads that became bookings.',
        ],
    ]);

    echo '<div class="shyn-control-grid two-up" style="margin-top: 18px;">';

    echo '<div class="shyn-control-card">';
    echo '<h2 class="shyn-control-section-title">What needs attention</h2>';
    echo '<p class="shyn-control-section-note">A short list of the newest people and their current status.</p>';

    if (!is_wp_error($recentLeads) && isset($recentLeads['leads']) && is_array($recentLeads['leads']) && !empty($recentLeads['leads'])) {
        echo '<div class="shyn-control-list">';
        foreach ($recentLeads['leads'] as $lead) {
            $name = !empty($lead['name']) ? $lead['name'] : 'Unnamed person';
            $visaType = isset($lead['visa_type']) ? $lead['visa_type'] : 'Unknown route';
            $status = isset($lead['status']) ? $lead['status'] : 'new';
            $score = isset($lead['score']) ? (int) $lead['score'] : 0;
            $createdAt = isset($lead['created_at']) ? shyn_control_format_time($lead['created_at']) : '';
            echo '<div class="shyn-control-list-item">';
            echo '<div class="shyn-control-list-row">';
            echo '<div>';
            echo '<div class="shyn-control-list-title">' . esc_html($name) . '</div>';
            echo '<div class="shyn-control-list-meta">' . esc_html($visaType) . ' · Score ' . esc_html((string) $score) . ' · ' . esc_html($createdAt) . '</div>';
            echo '</div>';
            echo '<div>' . shyn_control_status_badge($status) . '</div>';
            echo '</div>';
            echo '</div>';
        }
        echo '</div>';
    } else {
        echo '<p class="shyn-control-small">No people have come in yet.</p>';
    }
    echo '</div>';

    echo '<div class="shyn-control-card">';
    echo '<h2 class="shyn-control-section-title">Live notes</h2>';
    echo '<p class="shyn-control-section-note">The latest plain-language messages from the system.</p>';

    $promptValue = (!is_wp_error($prompt) && isset($prompt['value']) && is_string($prompt['value'])) ? trim($prompt['value']) : '';
    $configuredFields = 0;
    if (!empty($localSettings['api_base_url'])) {
        $configuredFields++;
    }
    if (!empty($localSettings['admin_api_key'])) {
        $configuredFields++;
    }

    echo '<div class="shyn-control-list">';
    echo '<div class="shyn-control-list-item">';
    echo '<div class="shyn-control-list-title">Connection</div>';
    echo '<div class="shyn-control-list-meta">Backend: ' . esc_html($localSettings['api_base_url']) . '</div>';
    echo '<div style="margin-top:8px;">' . shyn_control_status_badge('Connected') . '</div>';
    echo '</div>';

    echo '<div class="shyn-control-list-item">';
    echo '<div class="shyn-control-list-title">Saved settings</div>';
    echo '<div class="shyn-control-list-meta">' . esc_html((string) $configuredFields) . ' of 2 connection details saved.</div>';
    echo '</div>';

    echo '<div class="shyn-control-list-item">';
    echo '<div class="shyn-control-list-title">AI instructions</div>';
    echo '<div class="shyn-control-list-meta">' . (!empty($promptValue) ? esc_html(wp_trim_words($promptValue, 22, '…')) : 'No custom instructions saved yet.') . '</div>';
    echo '</div>';
    echo '</div>';
    echo '</div>';

    echo '<div class="shyn-control-grid two-up" style="margin-top: 18px;">';

    echo '<div class="shyn-control-card">';
    echo '<h2 class="shyn-control-section-title">Recent reviews</h2>';
    echo '<p class="shyn-control-section-note">A quick look at what customers said and whether a reply draft is ready.</p>';
    if (!is_wp_error($recentReviews) && isset($recentReviews['reviews']) && is_array($recentReviews['reviews']) && !empty($recentReviews['reviews'])) {
        echo '<div class="shyn-control-list">';
        foreach ($recentReviews['reviews'] as $review) {
            $author = !empty($review['author']) ? $review['author'] : 'Anonymous';
            $source = isset($review['source']) ? $review['source'] : 'Review';
            $rating = isset($review['rating']) ? (int) $review['rating'] : 0;
            $approved = !empty($review['approved']);
            echo '<div class="shyn-control-list-item">';
            echo '<div class="shyn-control-list-row">';
            echo '<div>';
            echo '<div class="shyn-control-list-title">' . esc_html($author) . '</div>';
            echo '<div class="shyn-control-list-meta">' . esc_html($source) . ' · ' . esc_html(shyn_control_format_rating($rating)) . '</div>';
            echo '</div>';
            echo '<div>' . shyn_control_status_badge($approved ? 'Ready to share' : 'Needs a reply') . '</div>';
            echo '</div>';
            if (!empty($review['content'])) {
                echo '<div class="shyn-control-card-note">' . esc_html(wp_trim_words((string) $review['content'], 24, '…')) . '</div>';
            }
            echo '</div>';
        }
        echo '</div>';
    } else {
        echo '<p class="shyn-control-small">No reviews have been pulled in yet.</p>';
    }
    echo '</div>';

    echo '<div class="shyn-control-card">';
    echo '<h2 class="shyn-control-section-title">Recent activity</h2>';
    echo '<p class="shyn-control-section-note">The latest actions the system took for you.</p>';
    if (!is_wp_error($recentAutomation) && isset($recentAutomation['logs']) && is_array($recentAutomation['logs']) && !empty($recentAutomation['logs'])) {
        echo '<div class="shyn-control-list">';
        foreach ($recentAutomation['logs'] as $log) {
            $eventType = isset($log['event_type']) ? (string) $log['event_type'] : 'activity';
            $status = isset($log['status']) ? (string) $log['status'] : 'queued';
            $createdAt = isset($log['created_at']) ? shyn_control_format_time($log['created_at']) : '';
            $detail = isset($log['detail']) && $log['detail'] ? (string) $log['detail'] : '';
            echo '<div class="shyn-control-list-item">';
            echo '<div class="shyn-control-list-row">';
            echo '<div>';
            echo '<div class="shyn-control-list-title">' . esc_html(shyn_control_plain_status($eventType)) . '</div>';
            echo '<div class="shyn-control-list-meta">' . esc_html($createdAt) . (!empty($detail) ? ' · ' . esc_html($detail) : '') . '</div>';
            echo '</div>';
            echo '<div>' . shyn_control_status_badge($status) . '</div>';
            echo '</div>';
            echo '</div>';
        }
        echo '</div>';
    } else {
        echo '<p class="shyn-control-small">No recent activity yet.</p>';
    }
    echo '</div>';

    echo '</div>';
    echo '</div>';
}

function shyn_control_render_leads_page() {
    shyn_control_render_styles();
    echo '<div class="wrap shyn-control-shell">';
    shyn_control_render_page_header('People who reached out', 'Everyone who contacted the firm from the website, AI assistant, or forms.', [
        ['label' => 'Back to dashboard', 'url' => admin_url('admin.php?page=shyn-control-center'), 'class' => 'button button-secondary'],
    ]);
    $data = shyn_control_call_api('/api/admin/leads');
    if (is_wp_error($data)) {
        echo '<div class="shyn-control-card"><p>Could not load people right now.</p></div></div>';
        return;
    }
    shyn_control_render_table('People list', isset($data['leads']) ? $data['leads'] : []);
    echo '</div>';
}

function shyn_control_render_conversations_page() {
    shyn_control_render_styles();
    echo '<div class="wrap shyn-control-shell">';
    shyn_control_render_page_header('Messages to review', 'The latest AI triage notes and summaries in plain language.', [
        ['label' => 'Back to dashboard', 'url' => admin_url('admin.php?page=shyn-control-center'), 'class' => 'button button-secondary'],
    ]);
    $data = shyn_control_call_api('/api/admin/conversations');
    if (is_wp_error($data)) {
        echo '<div class="shyn-control-card"><p>Could not load messages right now.</p></div></div>';
        return;
    }
    shyn_control_render_table('Messages', isset($data['conversations']) ? $data['conversations'] : []);
    echo '</div>';
}

function shyn_control_render_appointments_page() {
    shyn_control_render_styles();
    echo '<div class="wrap shyn-control-shell">';
    shyn_control_render_page_header('Bookings', 'Meetings that are booked, rescheduled, or cancelled.', [
        ['label' => 'Back to dashboard', 'url' => admin_url('admin.php?page=shyn-control-center'), 'class' => 'button button-secondary'],
    ]);
    $data = shyn_control_call_api('/api/admin/appointments');
    if (is_wp_error($data)) {
        echo '<div class="shyn-control-card"><p>Could not load bookings right now.</p></div></div>';
        return;
    }
    shyn_control_render_table('Bookings', isset($data['appointments']) ? $data['appointments'] : []);
    echo '</div>';
}

function shyn_control_render_reviews_page() {
    shyn_control_render_styles();
    echo '<div class="wrap shyn-control-shell">';
    shyn_control_render_page_header('Reviews', 'Customer feedback and any reply drafts ready for review.', [
        ['label' => 'Back to dashboard', 'url' => admin_url('admin.php?page=shyn-control-center'), 'class' => 'button button-secondary'],
    ]);
    $data = shyn_control_call_api('/api/admin/reviews');
    if (is_wp_error($data)) {
        echo '<div class="shyn-control-card"><p>Could not load reviews right now.</p></div></div>';
        return;
    }
    shyn_control_render_table('Reviews', isset($data['reviews']) ? $data['reviews'] : []);
    echo '</div>';
}

function shyn_control_render_automation_logs_page() {
    shyn_control_render_styles();
    echo '<div class="wrap shyn-control-shell">';
    shyn_control_render_page_header('Activity', 'A running log of what the system already handled for you.', [
        ['label' => 'Back to dashboard', 'url' => admin_url('admin.php?page=shyn-control-center'), 'class' => 'button button-secondary'],
    ]);
    $data = shyn_control_call_api('/api/admin/automation-logs');
    if (is_wp_error($data)) {
        echo '<div class="shyn-control-card"><p>Could not load activity right now.</p></div></div>';
        return;
    }
    shyn_control_render_table('Activity', isset($data['logs']) ? $data['logs'] : []);
    echo '</div>';
}

function shyn_control_render_ai_prompt_page() {
    shyn_control_render_styles();
    echo '<div class="wrap shyn-control-shell">';
    shyn_control_render_page_header('AI instructions', 'Edit the short guidance the backend uses when it reads a new enquiry.', [
        ['label' => 'Back to dashboard', 'url' => admin_url('admin.php?page=shyn-control-center'), 'class' => 'button button-secondary'],
    ]);

    if (!current_user_can('manage_options')) {
        echo '</div>';
        return;
    }

    if (isset($_POST['shyn_ai_prompt_nonce']) && wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['shyn_ai_prompt_nonce'])), 'shyn_ai_prompt_save')) {
        $prompt = isset($_POST['ai_system_prompt']) ? wp_unslash($_POST['ai_system_prompt']) : '';
        $result = shyn_control_post_api('/api/admin/ai-prompt', [
            'value' => $prompt,
        ]);

        if (is_wp_error($result)) {
            echo '<div class="notice notice-error"><p>Could not save prompt.</p></div>';
        } else {
            echo '<div class="notice notice-success is-dismissible"><p>Prompt saved.</p></div>';
        }
    }

    $data = shyn_control_call_api('/api/admin/ai-prompt');
    $value = '';
    if (!is_wp_error($data) && isset($data['value']) && is_string($data['value'])) {
        $value = $data['value'];
    }
    ?>
    <form method="post" class="shyn-control-card">
        <?php wp_nonce_field('shyn_ai_prompt_save', 'shyn_ai_prompt_nonce'); ?>
        <p class="shyn-control-section-note">Keep this short and practical. It helps the backend decide how to read each message.</p>
        <textarea name="ai_system_prompt" rows="10" class="large-text code"><?php echo esc_textarea($value); ?></textarea>
        <?php submit_button('Save AI Prompt'); ?>
    </form>
    <?php
    echo '</div>';
}

/* ──────────────────────────────────────────────────────────
 * WordPress REST API — Next.js frontend relay
 * Base: /wp-json/shyn/v1/
 * ────────────────────────────────────────────────────────── */
add_action('rest_api_init', function () {

    register_rest_route('shyn/v1', '/reviews', [
        'methods'             => 'GET',
        'callback'            => function () {
            $data = shyn_control_call_api('/api/reviews');
            if (is_wp_error($data)) {
                return new WP_REST_Response(['reviews' => []], 502);
            }
            return new WP_REST_Response($data, 200);
        },
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('shyn/v1', '/ai/assess', [
        'methods'             => 'POST',
        'callback'            => function (WP_REST_Request $req) {
            $result = shyn_control_post_api('/api/ai/assess', $req->get_json_params());
            if (is_wp_error($result)) {
                return new WP_REST_Response(['error' => $result->get_error_message()], 502);
            }
            return new WP_REST_Response($result, 200);
        },
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('shyn/v1', '/contact', [
        'methods'             => 'POST',
        'callback'            => function (WP_REST_Request $req) {
            $result = shyn_control_post_api('/api/contact', $req->get_json_params());
            if (is_wp_error($result)) {
                return new WP_REST_Response(['error' => $result->get_error_message()], 502);
            }
            return new WP_REST_Response($result, 201);
        },
        'permission_callback' => '__return_true',
    ]);

    foreach (['create', 'reschedule', 'cancel', 'suggest'] as $action) {
        $captured = $action;
        register_rest_route('shyn/v1', '/appointments/' . $captured, [
            'methods'             => 'POST',
            'callback'            => function (WP_REST_Request $req) use ($captured) {
                $result = shyn_control_post_api('/api/appointments/' . $captured, $req->get_json_params());
                if (is_wp_error($result)) {
                    return new WP_REST_Response(['error' => $result->get_error_message()], 502);
                }
                return new WP_REST_Response($result, 200);
            },
            'permission_callback' => '__return_true',
        ]);
    }
});

/* CORS: allow Next.js dev server to call the WP REST endpoints */
add_filter('rest_pre_serve_request', function ($served, $result, $request) {
    $origin  = isset($_SERVER['HTTP_ORIGIN']) ? sanitize_text_field(wp_unslash($_SERVER['HTTP_ORIGIN'])) : '';
    $allowed = ['http://localhost:3000', 'http://127.0.0.1:3000'];
    if (in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
    }
    return $served;
}, 10, 3);

add_action('admin_menu', function () {
    add_menu_page('Shyn Control Center', 'Shyn Control', 'manage_options', 'shyn-control-center', 'shyn_control_render_dashboard_page', 'dashicons-shield', 2);
    add_submenu_page('shyn-control-center', 'People who reached out', 'People', 'manage_options', 'shyn-control-leads', 'shyn_control_render_leads_page');
    add_submenu_page('shyn-control-center', 'Messages to review', 'Messages', 'manage_options', 'shyn-control-conversations', 'shyn_control_render_conversations_page');
    add_submenu_page('shyn-control-center', 'Bookings', 'Bookings', 'manage_options', 'shyn-control-appointments', 'shyn_control_render_appointments_page');
    add_submenu_page('shyn-control-center', 'Reviews', 'Reviews', 'manage_options', 'shyn-control-reviews', 'shyn_control_render_reviews_page');
    add_submenu_page('shyn-control-center', 'Activity', 'Activity', 'manage_options', 'shyn-control-automation-logs', 'shyn_control_render_automation_logs_page');
    add_submenu_page('shyn-control-center', 'AI instructions', 'AI instructions', 'manage_options', 'shyn-control-ai-prompt', 'shyn_control_render_ai_prompt_page');
    add_submenu_page('shyn-control-center', 'Connection settings', 'Connection', 'manage_options', 'shyn-control-settings', 'shyn_control_render_settings_page');
    remove_submenu_page('shyn-control-center', 'shyn-control-center');
});

add_action('admin_menu', function () {
    remove_menu_page('edit.php');
    remove_menu_page('upload.php');
    remove_menu_page('edit.php?post_type=page');
    remove_menu_page('edit-comments.php');
    remove_menu_page('themes.php');
    remove_menu_page('plugins.php');
    remove_menu_page('users.php');
    remove_menu_page('tools.php');
    remove_menu_page('options-general.php');
}, 999);
